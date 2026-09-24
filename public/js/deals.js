(function () {
  // Stand-in for an expensive pricing recalculation.
  function busyWork(ms) {
    const end = performance.now() + ms;
    let x = 0;
    while (performance.now() < end) {
      x += Math.sqrt(Math.random() * 1000);
    }
    return x;
  }

  // [BUG – perf: total-blocking-time] The first several ticks each block the
  // main thread for ~250 ms while the page is still loading.
  const saleEnds = Date.now() + 5 * 60 * 60 * 1000;
  const timer = document.getElementById("timer");
  let ticks = 0;

  function tick() {
    if (ticks < 6) busyWork(250);
    ticks += 1;
    const left = Math.max(0, saleEnds - Date.now());
    const h = String(Math.floor(left / 3600000)).padStart(2, "0");
    const m = String(Math.floor((left % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
    timer.textContent = h + ":" + m + ":" + s;
  }

  tick();
  setInterval(tick, 1000);

  // [BUG – perf: cumulative-layout-shift] Promo bar injected above the page
  // 1.5 s after load with no reserved space, so all content jumps down.
  setTimeout(function () {
    const bar = document.createElement("div");
    bar.className = "promo-bar";

    const text = document.createElement("strong");
    text.textContent = "Free shipping on orders over $50. ";

    const link = document.createElement("a");
    link.href = "/products.html";
    link.textContent = "Shop now";

    bar.append(text, link);
    document.getElementById("promo-slot").appendChild(bar);
  }, 1500);
})();
