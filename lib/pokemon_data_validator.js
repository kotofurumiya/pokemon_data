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
  validate(pokemonList) {
    // パスしたポケモン一覧。
    const passedPokemons = [];

    // 発見されたエラーポケモン一覧。
    const errorPokemons = [];

    // エラーメッセージ一覧。
    const errorMessages = [];

    // 全ポケモンデータを走査する。
    pokemonList.forEach((pokemon) => {
      // バリデーションを通ったかどうか。
      let isPassed = true;

      // 図鑑Noの判定。
      const existsPokedexNo = 'no' in pokemon;
      if (!existsPokedexNo) {
        errorMessages.push(this._buildErrorMessage(pokemon, '数値"no"が存在しません。'));
        isPassed = false;
      }

      // 名前の判定。
      const existsName = 'name' in pokemon;
      if(!existsName) {
        errorMessages.push(this._buildErrorMessage(pokemon, '文字列"name"が存在しません。'));
        isPassed = false;
      }

      // フォルム名の判定
      const existsForm = 'form' in pokemon;
      if(!existsForm) {
        errorMessages.push(this._buildErrorMessage(pokemon, '文字列"form"が存在しません。'));
        isPassed = false;
      }

      // メガシンカの判定。
      const existsMegaEvolution = 'isMegaEvolution' in pokemon;
      if(!existsMegaEvolution) {
        errorMessages.push(this._buildErrorMessage(pokemon, 'bool値"isMegaEvolution"が存在しません。'));
        isPassed = false;
      }

      // 進化先の判定。
      const existsEvolutions = 'evolutions' in pokemon;
      if(!existsEvolutions) {
        errorMessages.push(this._buildErrorMessage(pokemon, '配列"evolutions"が存在しません。'));
        isPassed = false;
      }

      // タイプ文字列の判定。
      const existsTypes = 'types' in pokemon;

      if(existsTypes) {
        const types = pokemon.types;
        for(let i=0; i<types.length; i++) {
          const type = types[i];
          const typeIsValid = this._validateType(type);

          if(!typeIsValid) {
            const message = this._buildErrorMessage(pokemon, `type${i+1}:"${type}"は存在しないタイプです。`);
            errorMessages.push(message);
            isPassed = false;
          }
        }
      } else {
        errorMessages.push(this._buildErrorMessage(pokemon, '配列"types"が存在しません。'));
        isPassed = false;
      }

      // 特性の判定。
      const existsAbilities = 'abilities' in pokemon;
      const existsHiddenAbilities = 'hiddenAbilities' in pokemon;

      if(!existsAbilities) {
        errorMessages.push(this._buildErrorMessage(pokemon, '配列"abilities"が存在しません。'));
        isPassed = false;
      }

      if(!existsHiddenAbilities) {
        errorMessages.push(this._buildErrorMessage(pokemon, '配列"hiddenAbilities"が存在しません。'));
        isPassed = false;
      }

      // 種族値の判定。
      const existsStats = 'stats' in pokemon;

      if(existsStats) {
        const stats = pokemon.stats;
        const existsHp = 'hp' in stats;
        const existsAtk = 'attack' in stats;
        const existsDef = 'defence' in stats;
        const existsSpAtk = 'spAttack' in stats;
        const existsSpDef = 'spDefence' in stats;
        const existsSpeed = 'speed' in stats;

        if(!existsHp) {
          errorMessages.push(this._buildErrorMessage(pokemon, '数値"hp"が存在しません。'));
          isPassed = false;
        }

        if(!existsAtk) {
          errorMessages.push(this._buildErrorMessage(pokemon, '数値"attack"が存在しません。'));
          isPassed = false;
        }

        if(!existsDef) {
          errorMessages.push(this._buildErrorMessage(pokemon, '数値"defence"が存在しません。'));
          isPassed = false;
        }

        if(!existsSpAtk) {
          errorMessages.push(this._buildErrorMessage(pokemon, '数値"spAttack"が存在しません。'));
          isPassed = false;
        }

        if(!existsSpDef) {
          errorMessages.push(this._buildErrorMessage(pokemon, '数値"spDefence"が存在しません。'));
          isPassed = false;
        }

        if(!existsSpeed) {
          errorMessages.push(this._buildErrorMessage(pokemon, '数値"speed"が存在しません。'));
          isPassed = false;
        }
      } else {
        errorMessages.push(this._buildErrorMessage(pokemon, 'オブジェクト"stats"が存在しません。'));
        isPassed = false;
      }

      // パスしたかどうかで振り分け。
      if(isPassed) {
        passedPokemons.push(pokemon);
      }
      else {
        errorPokemons.push(pokemon);
      }
    });

    const isFine = errorPokemons.length === 0;
    return new ValidationResult(isFine, passedPokemons, errorPokemons, errorMessages);
  }

  _buildErrorMessage(pokemon, message) {
    const no = ('no' in pokemon) ? pokemon.no.toString() : '???';
    const name = ('name' in pokemon) ? pokemon.name : '???';
    const form = ('form' in pokemon) ? pokemon.form : '';
    const fullName = (form !== '') ? `${name}（${form}）` : name;

    return `No.${no} ${fullName}: ${message}`;
  }

  _validateType(type) {
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
}

module.exports = PokemonDataValidator;