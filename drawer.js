const { chromium, devices } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const mk = async (opts, name) => {
    const ctx = await b.newContext(opts);
    await ctx.addInitScript(() => { localStorage.setItem("eutn:disclaimer-v1","true"); localStorage.setItem("eutn:prefs",JSON.stringify({lang:"ar",theme:"dark",fontSize:16,muted:true})); });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on("pageerror", e => errs.push(e.message.slice(0, 60)));
    await pg.goto("http://localhost:8088/", { waitUntil: "networkidle" });
    await pg.waitForTimeout(1200);
    await pg.click("header button:first-of-type");
    await pg.waitForTimeout(300);
    const btn = pg.locator("nav button", { hasText: "ثبّت التطبيق" });
    const vis = await btn.first().isVisible().catch(() => false);
    console.log(name, "| bouton tiroir visible:", vis, "| erreurs:", errs.length ? errs.join(";") : "aucune");
    if (vis) { await btn.first().click(); await pg.waitForTimeout(400); await pg.screenshot({ path: name + ".png" }); }
    await ctx.close();
  };
  await mk({ viewport: { width: 390, height: 800 } }, "x-android");
  await mk({ ...devices["iPhone 13"] }, "x-ios");
  await b.close();
})();
