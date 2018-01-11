#!/usr/bin/env node

const { sync } = require('glob');
const { writeFileSync } = require('fs');
const { extname, dirname } = require('path');
const meow = require('meow');

const cli = meow();
const files = cli.input;

files.forEach(file => {
    const dir = dirname(file);
    const ext = extname(file);

    const content =
        sync(`${dir}/**/*${ext}`)
            .filter(file => file !== `${dir}/index${ext}`)
            .map(
                line =>
                    "export * from '" +
                    line
                        .replace(`${dir}/`, './')
                        .replace(ext, '')
                        .replace('/index', '') +
                    "';"
            )
            .join('\n') + '\n';

    writeFileSync(file, content, 'utf8');
});
