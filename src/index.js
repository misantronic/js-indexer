#!/usr/bin/env node

const { sync } = require("glob");
const { writeFileSync } = require("fs");
const { extname, dirname, basename } = require("path");
const meow = require("meow");

const cli = meow();
const files = cli.input;
const { filter, exclude } = cli.flags;

files.forEach((file) => {
  const dir = dirname(file);
  const ext = extname(file);
  const exts = [ext, ".js", ".jsx", ".ts", ".tsx"];

  let content =
    sync(
      `${dir}/**/!(*[._]test).{${exts.map((ext) => ext.substr(1)).join(",")}}`
    )
      .filter((file) => (filter ? new RegExp(filter).test(file) : true))
      .filter((file) => (exclude ? !new RegExp(exclude).test(file) : true))
      .filter((file) => file !== `${dir}/index${ext}`)
      .filter((file) => basename(file).startsWith("_") === false)
      .map(
        (line) =>
          "export * from '" +
          line
            .replace(`${dir}/`, "./")
            .replace(
              new RegExp(exts.map((ext) => `\\${ext}`).join("|"), "g"),
              ""
            )
            .replace("/index", "") +
          "';"
      )
      .join("\n") + "\n";

  content = `// @generated\n${content}`;

  writeFileSync(file, content, "utf8");
});
