const path = require("path");
const express = require("express");
const searchRoutes = require("./src/routes/search");
const diagnosticsRoutes = require("./src/routes/diagnostics");
const { cartTotal } = require("./src/utils/pricing");

const app = express();
const PORT = process.env.PORT || 3000;

// [BUG – performance] Every response is marked uncacheable and nothing is
// compressed, so Lighthouse flags long-cache-ttl and text-compression.
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(
  express.static(path.join(__dirname, "public"), {
    etag: false,
    lastModified: false,
    cacheControl: false,
  }),
);

app.use("/api", searchRoutes);
app.use("/api", diagnosticsRoutes);

app.get("/api/cart-total", (req, res) => {
  const items = [
    { price: 19.99, qty: 2 },
    { price: 5.5, qty: 1 },
  ];
  res.json({ total: cartTotal(items) });
});

app.listen(PORT, () => {
  console.log(`nfunc-mcp-testbed running at http://localhost:${PORT}`);
});
