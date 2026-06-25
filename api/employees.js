export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {

    const SCRIPT_URL = process.env.SCRIT;

    let payload = {};

    if (req.method === "GET") {
      payload = {
        action: req.query.action || ""
      };
    } else {
      payload = req.body || {};
    }

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    return res.status(200).send(text);

  } catch (err) {

    return res.status(500).json({
      ok: false,
      error: String(err)
    });

  }

}
