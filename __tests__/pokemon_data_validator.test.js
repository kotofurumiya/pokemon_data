const fs = require('fs');
const PokemonDataValidator = require('../lib/pokemon_data_validator');

test('Valid Pokemon', () => {
  const jsonStr = fs.readFileSync('./__tests__/testdata/valid_pokemon.json');
  const pokemonData = JSON.parse(jsonStr);
  const validator = new PokemonDataValidator();
  const validationResult = validator.validate(pokemonData);

  expect(validationResult.isFine).toBeTruthy();
});

test('Empty Pokemon', () => {
  const jsonStr = fs.readFileSync('./__tests__/testdata/empty_pokemon.json');
  const pokemonData = JSON.parse(jsonStr);
  const validator = new PokemonDataValidator();
  const validationResult = validator.validate(pokemonData);

  const errorLength = 9;

  expect(validationResult.isFine).toBeFalsy();
  expect(validationResult.errorMessages).toHaveLength(errorLength);
});

test('Invalid Type', () => {
  const jsonStr = fs.readFileSync('./__tests__/testdata/invalid_type_pokemon.json');
  const pokemonData = JSON.parse(jsonStr);
  const validator = new PokemonDataValidator();
  const validationResult = validator.validate(pokemonData);

  const errorLength = 2;

  expect(validationResult.isFine).toBeFalsy();
  expect(validationResult.errorMessages).toHaveLength(errorLength);
});