const fs = require('fs');
const PokemonDataValidator = require('./lib/pokemon_data_validator');

const dataFilePath = 'data/pokemon_data.json';

const validator = new PokemonDataValidator();
const jsonStr = fs.readFileSync(dataFilePath);
const json = JSON.parse(jsonStr);

const validationResult = validator.validate(json);

if(validationResult.isFine) {
  console.log('正常です。エラーはありませんでした。');
} else {
  const errors = validationResult.errorMessages;
  console.error(`${errors.length}件のエラー。`);
  errors.forEach((e) => console.error(e));
}

console.log(`正常なポケモンデータ：${validationResult.passedPokemons.length}件`);
console.log(`異常のあったポケモンデータ：${validationResult.errorPokemons.length}件`);

process.exit(0);