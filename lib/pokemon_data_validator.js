class ValidationResult {
  constructor(isFine, passedPokemons, errorPokemons, errorMessages) {
    this._isFine = isFine;
    this._passedPokemons = passedPokemons;
    this._errorPokemons = errorPokemons;
    this._errorMessages = errorMessages;
  }

  get isFine() {
    return this._isFine;
  }

  get passedPokemons() {
    return [...this._passedPokemons];
  }

  get errorPokemons() {
    return [...this._errorPokemons];
  }

  get errorMessages() {
    return [...this._errorMessages];
  }
}

class PokemonDataValidator {
  constructor() {
    this._errorMessages = [];
  }

  validate(pokemonList) {
    this._errorMessages = [];

    // パスしたポケモン一覧。
    const passedPokemons = [];

    // 発見されたエラーポケモン一覧。
    const errorPokemons = [];

    // 全ポケモンデータを走査する。
    pokemonList.forEach((pokemon) => {
      // パスしたかどうかで振り分け。
      const isPassed = this._validatePokemon(pokemon);

      if(isPassed) {
        passedPokemons.push(pokemon);
      } else {
        errorPokemons.push(pokemon);
      }
    });

    const isFine = errorPokemons.length === 0;
    return new ValidationResult(isFine, passedPokemons, errorPokemons, [...this._errorMessages]);
  }

  _buildErrorMessage(pokemon, message) {
    const no = ('no' in pokemon) ? pokemon.no.toString() : '???';
    const name = ('name' in pokemon) ? pokemon.name : '???';
    const form = ('form' in pokemon) ? pokemon.form : '';
    const fullName = (form !== '') ? `${name}（${form}）` : name;

    return `No.${no} ${fullName}: ${message}`;
  }

  _validateTypeString(type) {
    const pokemonTypeList = [
      'ノーマル',
      'ほのお',
      'みず',
      'でんき',
      'くさ',
      'こおり',
      'かくとう',
      'どく',
      'じめん',
      'ひこう',
      'エスパー',
      'むし',
      'いわ',
      'ゴースト',
      'ドラゴン',
      'あく',
      'はがね',
      'フェアリー',
      ''
    ];

    return pokemonTypeList.includes(type);
  }

  _validateArray(pokemon, key, array, expectedType) {
    if(Array.isArray(array)) {
      // 配列の場合は要素の型を調べる。
      const elementsAreValid = (expectedType === null) || array.every((e) => typeof e === expectedType);

      if(!elementsAreValid) {
        this._buildErrorMessage(pokemon, `array"${key}"の要素は全て${expectedType}である必要があります。`);
        this._errorMessages.push(message);
      }

      return elementsAreValid;
    } else {
      // 配列でない場合はエラー。
      this._buildErrorMessage(pokemon, `"${key}"の値はarrayである必要があります。`);
      this._errorMessages.push(message);
      return false;
    }
  }

  _validateKeyAndValueType(pokemon, key, expectedType, expectedElementType = null) {
    const hasKey = key in pokemon;

    // キーが無い場合はfalse。
    if(!hasKey) {
      const message = this._buildErrorMessage(pokemon, `${expectedType}型のキー"${key}"が存在しません。`);
      this._errorMessages.push(message);
      return false;
    }

    // キーがある場合は型を調べる。
    const value = pokemon[key];

    if(expectedType === 'array') {
      // 配列の場合は配列かどうかを調べ、配列ならば中の型も調べる。
      return this._validateArray(pokemon, key, value, expectedElementType);
    } else {
      // 配列以外の場合は型を調べる。
      const valueIsValidType = (value !== null) && (typeof value === expectedType);

      if(!valueIsValidType) {
        const message = this._buildErrorMessage(pokemon, `"${key}"の値は${expectedType}である必要があります。`);
        this._errorMessages.push(message);
      }

      return valueIsValidType;
    }
  }

  _validateType(pokemon) {
    const isValidArray = this._validateKeyAndValueType(pokemon, 'types', 'array', 'string');

    if(isValidArray) {
      // すべてのタイプを検査。
      let isPassed = true;
      const types = pokemon.types;
      for(let i=0; i<types.length; i++) {
        const type = types[i];
        const typeIsValid = this._validateTypeString(type);

        if(!typeIsValid) {
          const message = this._buildErrorMessage(pokemon, `type${i+1}:"${type}"は存在しないタイプです。`);
          this._errorMessages.push(message);
          isPassed = false;
        }
      }

      return isPassed;
    }

    return isValidArray;
  }

  _validateStats(pokemon) {
    const isValidObject = this._validateKeyAndValueType(pokemon, 'stats', 'object');

    if(isValidObject) {
      const stats = pokemon.stats;
      const hasHp = 'hp' in stats;
      const hasAtk = 'attack' in stats;
      const hasDef = 'defence' in stats;
      const hasSpAtk = 'spAttack' in stats;
      const hasSpDef = 'spDefence' in stats;
      const hasSpeed = 'speed' in stats;

      let isPassed = true;

      if(!hasHp) {
        this._errorMessages.push(this._buildErrorMessage(pokemon, 'オブジェクト"stats"内に数値"hp"が存在しません。'));
        isPassed = false;
      }

      if(!hasAtk) {
        this._errorMessages.push(this._buildErrorMessage(pokemon, 'オブジェクト"stats"内に数値"attack"が存在しません。'));
        isPassed = false;
      }

      if(!hasDef) {
        this._errorMessages.push(this._buildErrorMessage(pokemon, 'オブジェクト"stats"内に数値"defence"が存在しません。'));
        isPassed = false;
      }

      if(!hasSpAtk) {
        this._errorMessages.push(this._buildErrorMessage(pokemon, 'オブジェクト"stats"内に数値"spAttack"が存在しません。'));
        isPassed = false;
      }

      if(!hasSpDef) {
        this._errorMessages.push(this._buildErrorMessage(pokemon, 'オブジェクト"stats"内に数値"spDefence"が存在しません。'));
        isPassed = false;
      }

      if(!hasSpeed) {
        this._errorMessages.push(this._buildErrorMessage(pokemon, '数値"speed"が存在しません。'));
        isPassed = false;
      }

      return isPassed;
    }

    return isValidObject;
  }

  _validatePokemon(pokemon) {
    const validations = [];

    // 図鑑Noの判定。
    const noIsValid = this._validateKeyAndValueType(pokemon, 'no', 'number');
    validations.push(noIsValid);

    // 名前の判定。
    const nameIsValid = this._validateKeyAndValueType(pokemon, 'name', 'string');
    validations.push(nameIsValid);

    // フォルム名の判定
    const formIsValid = this._validateKeyAndValueType(pokemon, 'form', 'string');
    validations.push(formIsValid);

    // メガシンカの判定。
    const megaIsValid = this._validateKeyAndValueType(pokemon, 'isMegaEvolution', 'boolean');
    validations.push(megaIsValid);

    // 進化先の判定。
    const evolutionsIsValid = this._validateKeyAndValueType(pokemon, 'evolutions', 'array', 'number');
    validations.push(evolutionsIsValid);

    // タイプの判定。
    const typesIsValid = this._validateType(pokemon);
    validations.push(typesIsValid);

    // 特性の判定。
    const abilitiesIsValid = this._validateKeyAndValueType(pokemon, 'abilities', 'array', 'string');
    const hiddenAbilitiesIsValid = this._validateKeyAndValueType(pokemon, 'hiddenAbilities', 'array', 'string');
    validations.push(abilitiesIsValid);
    validations.push(hiddenAbilitiesIsValid);

    // 種族値の判定。
    const statsIsValid = this._validateStats(pokemon);
    validations.push(statsIsValid);

    // すべてのバリデーションを通過したかどうかを返す。
    return validations.every((v) => v === true);
  }
}

module.exports = PokemonDataValidator;