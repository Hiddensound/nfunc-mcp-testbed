// In-memory stand-in for a SQL database. It does not parse SQL; it exists so
// the routes read like real data-access code for the static analysers.
const products = [
  { id: 1, name: "Trail Runner Shoe", price: 89.0 },
  { id: 2, name: "Merino Hiking Sock", price: 18.5 },
  { id: 3, name: "Packable Rain Shell", price: 129.0 },
  { id: 4, name: "Insulated Bottle", price: 32.0 },
];

function query(sql) {
  return Promise.resolve({ sql, rows: products });
}

module.exports = { query };
