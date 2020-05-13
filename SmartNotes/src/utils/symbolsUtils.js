import list from "../symbols.json";

export function getExactSymbolMatch(word) {
  var symbol;

  Object.keys(list.symbols.mathematical).forEach((key) => {
    if (key.localeCompare(word) === 0) {
      symbol = list.symbols.mathematical[key];
    }
  });

  Object.keys(list.symbols.greek_alphabet).forEach((key) => {
    if (key.localeCompare(word) === 0) {
      symbol = list.symbols.greek_alphabet[key];
    }
  });

  Object.keys(list.symbols.double_struck_alphabet).forEach((key) => {
    if (key.localeCompare(word) === 0) {
      symbol = list.symbols.double_struck_alphabet[key];
    }
  });

  return symbol;
}

function isRelevantSuggestion(word, key) {
  return key.includes(word);
}

export function getSuggestions(word) {
  var suggestions = [];
  Object.keys(list.symbols.mathematical).forEach((key) => {
    if (isRelevantSuggestion(word, key)) {
      suggestions.push({
        name: key,
        unicode: list.symbols.mathematical[key],
      });
    }
  });

  Object.keys(list.symbols.greek_alphabet).forEach((key) => {
    if (isRelevantSuggestion(word, key)) {
      suggestions.push({
        name: key,
        unicode: list.symbols.greek_alphabet[key],
      });
    }
  });
  Object.keys(list.symbols.double_struck_alphabet).forEach((key) => {
    if (isRelevantSuggestion(word, key)) {
      suggestions.push({
        name: key,
        unicode: list.symbols.double_struck_alphabet[key],
      });
    }
  });

  return suggestions;
}

export function rowsNeededForSymbol(symbol) {
  if (list.threeRows.includes(symbol)) {
    return 3;
  } else if (list.twoRows.includes(symbol)) {
    return 2;
  }
  return 1;
}
