const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const { test } = require("node:test");

const root = path.resolve(__dirname, "../miniprogram");
const config = JSON.parse(fs.readFileSync(path.join(root, "app.json"), "utf8"));

for (const pagePath of config.pages) {
  for (const copyFails of [false, true]) {
    test(`${pagePath} forwards with ${copyFails ? "packaged" : "local"} cover`, () => {
      const filename = path.join(root, `${pagePath}.js`);
      const requirePage = createRequire(filename);
      const shareModule = { exports: {} };
      const copies = [];
      vm.runInNewContext(fs.readFileSync(path.join(root, "utils/share.js"), "utf8"), {
        module: shareModule,
        wx: {
          env: { USER_DATA_PATH: "wxfile://usr" },
          getFileSystemManager: () => ({
            copyFileSync(source, destination) {
              copies.push({ source, destination });
              if (copyFails) throw new Error("Local image copy unavailable");
            },
          }),
        },
      });
      let page;
      vm.runInNewContext(fs.readFileSync(filename, "utf8"), {
        require: name => name === "../../utils/share" ? shareModule.exports : requirePage(name),
        Page(definition) { page = definition; },
      }, { filename });

      assert.equal(typeof page.onShareAppMessage, "function");
      const sender = { data: { user: { id: 123, name: "PRIVATE_TEST_DATA" }, deviceLinkCode: "TEST_ONLY" } };
      const message = page.onShareAppMessage.call(sender, { from: "menu" });
      const buttonMessage = page.onShareAppMessage.call(sender, { from: "button" });
      assert.deepEqual(buttonMessage, message);
      assert.deepEqual(Object.keys(message).sort(), ["imageUrl", "path", "title"]);
      assert.ok(message.title.includes(config.window.navigationBarTitleText));
      assert.equal(message.path, `/${config.pages[0]}`);
      assert.ok(fs.existsSync(path.join(root, `${message.path.slice(1)}.js`)));
      assert.equal(JSON.stringify(message).includes("PRIVATE_TEST_DATA"), false);
      assert.equal(JSON.stringify(message).includes("TEST_ONLY"), false);

      assert.equal(copies.length, 2);
      assert.equal(message.imageUrl, copyFails ? copies[0].source : copies[0].destination);
      const cover = fs.readFileSync(path.join(root, copies[0].source.slice(1)));
      assert.equal(cover.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.equal(cover.readUInt32BE(16) / cover.readUInt32BE(20), 5 / 4);
    });
  }
}
