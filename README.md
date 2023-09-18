# Description:
numberFormatterUtil is a powerful and flexible library for number formatting in JavaScript.

## Peculiarities
- Supports various number formats.
- Functions to convert strings to numbers and vice versa.
- Localization and currency formatting.

## Installation
```bash
npm i number-formatter-util
```

## Example of usage
```bash
import numberFormatter from 'number-formatter-util';

const formatter = numberFormatter({
  decimals: 0,
});

console.log(formatter(12345.678)); // Example output: "12345"
console.log(formatter.to(12345.678)); // Example output:: "12,345.68"
console.log(formatter.from("12,345.68")); // Example output:: 12345.68
```

## License
This project is licensed under the MIT license.

## Contact the author
If you have questions or suggestions, please contact me at https://github.com/alex-lenk
