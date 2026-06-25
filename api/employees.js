```javascript
// api/employees.js

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const SCRIPT_URL = process.env.SCRIT;

  if (
    !SCRIPT_URL ||
    !SCRIPT_URL.includes("script.google.com")
  ) {
    return res.status(500).json({
      ok: false,
      error: "SCRIT environment variable is missing or invalid"
    });
  }

  try {
    // ===== GET REQUEST =====
    if (req.method === "GET") {
      const action = req.query.action || "";

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action
        })
      });

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        result = {
          ok: false,
          error: "Invalid JSON response",
          raw: text
        };
      }

      return res.status(200).json(result);
    }

    // ===== POST REQUEST =====
    if (req.method === "POST") {
      const body = req.body || {};

      const payload = {
        action: body.action || "",

        // Employees
        employeeNumber: body.employeeNumber || "",
        employeeName: body.employeeName || "",
        employeePosition: body.employeePosition || "",

        // Advances
        date: body.date || "",
        name: body.name || "",
        amount: body.amount || "",
        type: body.type || "",
        details: body.details || "",

        // Delete
        row: body.row || ""
      };

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        result = {
          ok: false,
          error: "Invalid JSON response",
          raw: text
        };
      }

      return res.status(200).json(result);
    }

    return res.status(405).json({
      ok: false,
      error: "Method Not Allowed"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
```
