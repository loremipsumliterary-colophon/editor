// GET /api/manifest -> elenco schemi selezionabili (etichette + hint).
const { MANIFEST } = require("../lib/schemas");

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ schemas: MANIFEST });
};
