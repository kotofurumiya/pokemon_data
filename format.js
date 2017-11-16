const fs = require('fs');

const dataFilePath = 'data/pokemon_data.json';

const jsonStr = fs.readFileSync(dataFilePath);
const json = JSON.parse(jsonStr);
const formattedJson = JSON.stringify(json, null, 2);

fs.writeFileSync(dataFilePath, formattedJson);

console.log('data/pokemon_data.jsonのフォーマットを整えました。');

process.exit(0);