// GET /api/health -> diagnostica ambiente del deployment corrente.
// Non espone mai il valore della chiave, solo se è presente.
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasAppToken: !!process.env.APP_TOKEN,
    vercelEnv: process.env.VERCEL_ENV || null,
    model: process.env.MODEL || "claude-sonnet-4-6 (default)",
  });
};
