# Valutatore LIAE/ITALIC

Mini-app personale: scegli uno schema di valutazione, carichi i materiali (manoscritto/estratto, `.eml` della submission, comunicazioni precedenti) e ottieni **lettera** + **note interne** in Markdown copiabile, secondo le direttive dello schema scelto.

Frontend statico (`index.html`) + una funzione serverless (`api/evaluate.js`) che custodisce la chiave Anthropic e fa da proxy. Gli schemi stanno in `api/schemas/` (un modulo JS per schema, generato dai JSON dell'agenzia).

## Cosa ti serve
- Un account Vercel (gratuito) e un account GitHub (consigliato), oppure la Vercel CLI.
- Una API key Anthropic (console.anthropic.com).

## Deploy in 5 passi

1. **Metti questa cartella in un repo GitHub** (o tienila locale per la CLI).

2. **Importa su Vercel**: vercel.com -> *Add New… -> Project* -> seleziona il repo. Framework preset: *Other* (nessun build necessario). Conferma.

   In alternativa via CLI:
   ```bash
   npm i -g vercel
   cd valutatore-liae
   vercel            # primo deploy (segui i prompt)
   ```

3. **Imposta le variabili d'ambiente** (Vercel -> Project -> *Settings -> Environment Variables*), per gli ambienti Production e Preview:
   - `ANTHROPIC_API_KEY` = la tua chiave Anthropic  *(obbligatoria)*
   - `APP_TOKEN` = una password a tua scelta  *(consigliata: protegge l'app e quindi la tua chiave da usi altrui)*
   - `MODEL` = `claude-sonnet-4-6`  *(opzionale; default già questo)*

4. **Rideploy** (Vercel -> Deployments -> *Redeploy*), così le variabili diventano attive. Con la CLI:
   ```bash
   vercel --prod
   ```

5. **Apri l'URL**. In alto a destra inserisci l'`APP_TOKEN`: resta memorizzato nel browser. Scegli lo schema, carica i materiali, *Genera valutazione*.

## Sviluppo locale
```bash
npm i -g vercel
vercel dev        # serve frontend + /api in locale su http://localhost:3000
```
Le variabili locali: crea un file `.env.local` con `ANTHROPIC_API_KEY=...` e `APP_TOKEN=...` (Vercel CLI le carica in `vercel dev`).

## Note
- **Timeout**: `vercel.json` alza il limite della funzione a 60s. Le valutazioni piu lunghe (Regular espansa su manoscritti interi) sono le piu pesanti; se sul piano Hobby incontri timeout, valuta testi piu corti o l'upgrade.
- **Estrazione testo**: avviene nel browser (PDF via pdf.js, DOCX via mammoth, ODT/RTF/DOC best-effort). I PDF scansionati senza testo non sono leggibili: convertili o incolla il testo.
- **Tipografia**: l'output viene normalizzato lato client (trattino medio, apostrofi e virgolette dritti) come ulteriore garanzia oltre alle istruzioni dello schema.
- **Aggiungere uno schema**: crea `lib/schemas/<Chiave>.js` con `module.exports = "<testo dello schema>";`, poi aggiungilo in `lib/schemas.js` (mappa `MAP` + array `MANIFEST`). Comparira automaticamente nel menu a tendina. NB: gli schemi stanno in `lib/` e NON in `api/`, perche Vercel conta ogni file in `api/` come Serverless Function (limite 12 sul piano Hobby).
- **Sicurezza**: senza `APP_TOKEN` l'app e aperta a chiunque abbia l'URL (e consumerebbe la tua chiave). Impostala.
