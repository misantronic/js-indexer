# js-indexer

creates index-file for a given folder to expose everthing inside

# usage

```bash
npm install js-indexer --save-dev

./node_modules/.bin/js-indexer ./src/components/index.js ./src/utils/index.ts
```

# filter via regexp

```bash
./node_modules/.bin/js-indexer --filter 'index\.js' ./src/components/index.js ./src/utils/index.ts
```

test-files and files with leading `_` will be excluded.
