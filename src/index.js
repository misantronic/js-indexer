#!/usr/bin/env node

const { sync } = require('glob');
const { writeFileSync } = require('fs');
const { extname, dirname } = require('path');
const meow = require('meow');

const cli = meow(
    `
Usage: npm start [-- options]

Options:
--file      Target path to write index file to.
            Always set the destination filename e.g. ./src/components/index.js
--help      This page
`,
    {
        alias: { h: 'help' }
    }
);

if (cli.flags.help) {
    cli.showHelp();
    process.exit(1);
}

const file = cli.flags.file;
const dir = dirname(file);
const ext = extname(file);

const content = sync(`${dir}/**/!(index)${ext}`)
    .map(
        line =>
            "export * from '" +
            line.replace(`${dir}/`, './').replace(ext, '') +
            "';"
    )
    .join('\n');

writeFileSync(file, content, 'utf8');
