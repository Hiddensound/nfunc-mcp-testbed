const express = require("express");
const { exec } = require("child_process");

const router = express.Router();

// [BUG – OWASP A03:2021 Injection / OS command injection]
// ?host=example.com;cat /etc/passwd runs an arbitrary shell command.
// Fix: validate the host and use execFile("ping", ["-c", "1", host]).
router.get("/ping", (req, res) => {
  const host = req.query.host;
  exec("ping -c 1 " + host, (err, stdout) => {
    if (err) {
      res.status(500).json({ error: "ping failed" });
      return;
    }
    res.type("text/plain").send(stdout);
  });
});

module.exports = router;
