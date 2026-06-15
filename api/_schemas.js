// Mappa chiave -> testo grezzo dello schema (moduli JS generati da JSON).
// Aggiungere un nuovo schema: crea api/schemas/<Key>.js e aggiungilo qui + nel MANIFEST.

const MAP = {
  Gratuito: require("./schemas/Gratuito.js"),
  Gratuito_Plus: require("./schemas/Gratuito_Plus.js"),
  ITALIC: require("./schemas/ITALIC.js"),
  Regular: require("./schemas/Regular.js"),
  Regular_espansa: require("./schemas/Regular_espansa.js"),
  TYPO: require("./schemas/TYPO.js"),
  Decisione_post_editing: require("./schemas/Decisione_post_editing.js"),
  GratuitoPlus_saggistica: require("./schemas/GratuitoPlus_saggistica.js"),
  Regular_espansa_saggistica: require("./schemas/Regular_espansa_saggistica.js"),
  Call_LettureDaSpiaggia: require("./schemas/Call_LettureDaSpiaggia.js"),
};

// Ordine e metadati mostrati nel frontend.
const MANIFEST = [
  { key: "Gratuito", label: "Gratuito — rifiuto breve", hint: "Carica il manoscritto. Esito: rifiuto sintetico, una sola criticità." },
  { key: "Gratuito_Plus", label: "Gratuito Plus — valutazione media", hint: "Carica il manoscritto. ~250-300 parole, scoring interno, almeno due riferimenti testuali." },
  { key: "ITALIC", label: "ITALIC — presentazione + estratto", hint: "Carica presentazione/estratto (ed eventuale .eml). Esito interlocutorio o negativo, 150-250 parole." },
  { key: "Regular", label: "Regular — manoscritto completo", hint: "Carica il manoscritto completo. Lettera ~1.020-1.380 parole." },
  { key: "Regular_espansa", label: "Regular espansa — manoscritto completo (sezionata)", hint: "Carica il manoscritto completo. Formato esteso ~2.300-2.700 parole." },
  { key: "TYPO", label: "TYPO — revisione (autori seguiti)", hint: "Carica la nuova versione e, nelle comunicazioni precedenti, le note/valutazioni passate. Esito TYPO_1/2/3." },
  { key: "Decisione_post_editing", label: "Decisione post-editing", hint: "Carica il testo e, nelle comunicazioni precedenti, la corrispondenza di editing." },
  { key: "GratuitoPlus_saggistica", label: "Gratuito Plus — saggistica", hint: "Saggistica/non-fiction. Carica il testo. Criteri ricalibrati per la non-fiction." },
  { key: "Regular_espansa_saggistica", label: "Regular espansa — saggistica", hint: "Saggistica/non-fiction. Manoscritto completo, formato esteso." },
  { key: "Call_LettureDaSpiaggia", label: "Call — Letture da spiaggia", hint: "Carica .eml della submission + estratto. Quattro esiti, filtro stretto." },
];

function getSchema(key) {
  return MAP[key] || null;
}

module.exports = { MAP, MANIFEST, getSchema };
