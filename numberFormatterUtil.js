const FormatOptions = [
  'decimals',
  'thousand',
  'mark',
  'prefix',
  'suffix',
  'encoder',
  'decoder',
  'negativeBefore',
  'negative',
  'edit',
  'undo',
];

const reverseString = str => str.split('').reverse().join('');

const startsWithString = (input, match) => input.substring(0, match.length) === match;

const endsWithString = (input, match) => input.slice(-1 * match.length) === match;

function checkForConflictingOptions(F, a, b) {
  if ((F[a] || F[b]) && F[a] === F[b]) {
    throw new Error(a);
  }
}

function isValidNumber(input) {
  return typeof input === 'number' && isFinite(input);
}

function toFixed(value, exp) {
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? +value[1] + exp : exp)));
  value = value.toString().split('e');
  return (+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp))).toFixed(exp);
}


function formatNumberToString(
  decimals,
  thousand,
  mark,
  prefix,
  suffix,
  encoder,
  decoder,
  negativeBefore,
  negative,
  edit,
  undo,
  input,
) {
  let originalInput = input,
    inputIsNegative,
    inputPieces,
    inputBase,
    inputDecimals = '',
    output = '';

  if (encoder) input = encoder(input);

  if (!isValidNumber(input)) return false;

  if (decimals !== false && parseFloat(input.toFixed(decimals)) === 0) input = 0;

  if (input < 0) {
    inputIsNegative = true;
    input = Math.abs(input);
  }

  if (decimals !== false) {
    input = toFixed(input, decimals);
  }

  input = input.toString();

  if (input.indexOf('.') !== -1) {
    inputPieces = input.split('.');

    inputBase = inputPieces[0];

    if (mark) inputDecimals = mark + inputPieces[1];
  } else {
    inputBase = input;
  }

  if (thousand) {
    inputBase = reverseString(inputBase).match(/.{1,3}/g);
    inputBase = reverseString(inputBase.join(reverseString(thousand)));
  }

  if (inputIsNegative && negativeBefore) {
    output += negativeBefore;
  }

  if (prefix) output += prefix;

  if (inputIsNegative && negative) output += negative;

  output += inputBase;
  output += inputDecimals;

  if (suffix) output += suffix;

  if (edit) output = edit(output, originalInput);

  return output;
}

function formatStringToNumber(
  decimals,
  thousand,
  mark,
  prefix,
  suffix,
  encoder,
  decoder,
  negativeBefore,
  negative,
  edit,
  undo,
  input,
) {
  let originalInput = input,
    inputIsNegative,
    output = '';

  if (undo) input = undo(input);

  if (!input || typeof input !== 'string') return false;

  if (negativeBefore && startsWithString(input, negativeBefore)) {
    input = input.replace(negativeBefore, '');
    inputIsNegative = true;
  }

  if (prefix && startsWithString(input, prefix)) {
    input = input.replace(prefix, '');
  }

  if (negative && startsWithString(input, negative)) {
    input = input.replace(negative, '');
    inputIsNegative = true;
  }

  if (suffix && endsWithString(input, suffix)) {
    input = input.slice(0, -1 * suffix.length);
  }

  if (thousand) input = input.split(thousand).join('');

  if (mark) input = input.replace(mark, '.');

  if (inputIsNegative) output += '-';

  output += input;

  output = output.replace(/[^0-9\.\-.]/g, '');

  if (output === '') return false;

  output = Number(output);

  if (decoder) output = decoder(output);

  if (!isValidNumber(output)) return false;

  return output;
}

function validate(inputOptions) {
  const MAX_DECIMALS = 8;
  let i,
    optionName,
    optionValue,
    filteredOptions = {};

  if (inputOptions['suffix'] === undefined) {
    inputOptions['suffix'] = inputOptions['postfix'];
  }

  for (i = 0; i < FormatOptions.length; i += 1) {
    optionName = FormatOptions[i];
    optionValue = inputOptions[optionName];

    if (optionValue === undefined) {
      if (optionName === 'negative' && !filteredOptions.negativeBefore) {
        filteredOptions[optionName] = '-';
      } else if (optionName === 'mark' && filteredOptions.thousand !== '.') {
        filteredOptions[optionName] = '.';
      } else {
        filteredOptions[optionName] = false;
      }

    } else if (optionName === 'decimals') {
      if (optionValue >= 0 && optionValue < MAX_DECIMALS) {
        filteredOptions[optionName] = optionValue;
      } else {
        throw new Error(optionName);
      }

    } else if (
      optionName === 'encoder' ||
      optionName === 'decoder' ||
      optionName === 'edit' ||
      optionName === 'undo'
    ) {
      if (typeof optionValue === 'function') {
        filteredOptions[optionName] = optionValue;
      } else {
        throw new Error(optionName);
      }

    } else {
      if (typeof optionValue === 'string') {
        filteredOptions[optionName] = optionValue;
      } else {
        throw new Error(optionName);
      }
    }
  }

  checkForConflictingOptions(filteredOptions, 'mark', 'thousand');
  checkForConflictingOptions(filteredOptions, 'prefix', 'negative');
  checkForConflictingOptions(filteredOptions, 'prefix', 'negativeBefore');

  return filteredOptions;
}

function passAll(options, method, input) {
  let i,
    args = [];

  for (i = 0; i < FormatOptions.length; i += 1) {
    args.push(options[FormatOptions[i]]);
  }

  args.push(input);
  return method.apply('', args);
}

function numberFormatterUtil(options) {
  if (typeof options !== 'object') return null;

  const validatedOptions = validate(options);
  return {
    to: input => passAll(validatedOptions, formatNumberToString, input),
    from: input => passAll(validatedOptions, formatStringToNumber, input),
  };
}

export default numberFormatterUtil;
