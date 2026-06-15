// POST /api/evaluate
// body: { schemaKey, materials }
// header: x-app-token (deve combaciare con APP_TOKEN se impostata)
// env: ANTHROPIC_API_KEY (obbligatoria), APP_TOKEN (consigliata), MODEL (opzionale)

const { getSchema } = require("../lib/schemas");
const CONTEXT = require("../lib/context"); // knowledge base (stringa)

function buildSystem(key, schemaText) {
  return [
    "Sei l'assistente editoriale dell'agenzia letteraria LIAE/ITALIC e operi come Jacopo Vigano (firma con l'accento: Jacopo Vigano' -> rendila sempre 'Jacopo Viganò'). Applichi RIGOROSAMENTE lo schema di valutazione fornito qui sotto, rispettandone esiti ammessi, soglie, lunghezze, registro, scoring e convenzioni di lettera. Non inventi elementi non presenti nei materiali.",
    "CONTESTO AGENZIA (knowledge base):\n" + (CONTEXT || "[non disponibile]"),
    "SCHEMA DA APPLICARE [" + key + "]:\n" + schemaText,
    "REGOLE DI OUTPUT COMUNI: leggi tutti i materiali forniti; se manca qualcosa che lo schema richiede (es. comunicazioni precedenti per TYPO o post-editing), segnalalo nelle note interne e procedi con quanto disponibile. Dai del tu. Registro 'brutalita elegante': verita senza crudelta, si colpisce il libro come oggetto editoriale, mai l'autore. La lettera e prosa pronta da inviare: niente elenchi puntati e niente titoli di sezione, SALVO i formati che lo schema prevede esplicitamente (es. Regular_espansa sezionata). Lo scoring resta SEMPRE interno, mai nella lettera.",
    "TIPOGRAFIA OBBLIGATORIA: nessun trattino lungo (usa il trattino medio per gli incisi); apostrofi e virgolette sempre dritti; titoli di opere in corsivo markdown (*Titolo*); eventuale rimando al canale ordinario come link markdown su testo-ancora.",
    "FORMATO DI RISPOSTA OBBLIGATORIO, senza preamboli ne code fence, esattamente:\n###ESITO###\n<etichetta d'esito secondo lo schema applicato>\n###LETTERA###\n<lettera in markdown, pronta da inviare>\n###NOTE_INTERNE###\nNON INVIARE\n<note interne secondo lo schema: scoring se previsto, motivazione, elementi da decidere prima dell'invio>",
  ].join("\n\n");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo non consentito" });
    return;
  }

  const APP_TOKEN = process.env.APP_TOKEN;
  if (APP_TOKEN) {
    const t = req.headers["x-app-token"] || "";
    if (t !== APP_TOKEN) {
      res.status(401).json({ error: "Token di accesso non valido." });
      return;
    }
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY non impostata nelle variabili di ambiente del progetto." });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const schemaKey = body && body.schemaKey;
  const materials = (body && body.materials) || "";
  const schemaText = getSchema(schemaKey);
  if (!schemaText) {
    res.status(400).json({ error: "Schema sconosciuto: " + schemaKey });
    return;
  }

  const system = buildSystem(schemaKey, schemaText);
  const userMsg = "=== MATERIALI DA VALUTARE ===\n" + (materials || "[nessun materiale fornito]");

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.MODEL || "claude-sonnet-4-6",
        max_tokens: 8000,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(502).json({ error: (data && data.error && data.error.message) || ("Errore Anthropic " + r.status) });
      return;
    }
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (!text) {
      res.status(502).json({ error: "Risposta vuota dal modello." });
      return;
    }
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || "Errore nella chiamata al modello." });
  }
};
