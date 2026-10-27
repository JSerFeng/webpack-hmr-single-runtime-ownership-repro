const assert = require("node:assert/strict");
const { setup } = require("./harness.cjs");
const config = require("./webpack.config.cjs");
const control = process.argv.includes("--control");
const h = setup(config);

(async () => {
  try {
    await h.start();
    h.edit(1); await h.compile("dep moves, shared stays");
    const moved = await h.update();
    assert.equal(moved.error, undefined);
    if (control) await app.load();
    h.edit(2); await h.compile("edit moved dep");
    const edited = await h.update();
    const actual = (await app.load()).default;
    h.save({ control, moved, edited, actual, expected: 3 });
    assert.equal(edited.error, undefined);
    assert.equal(actual, 3, "HMR completed but the later import returned stale module cache");
  } finally { await h.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
