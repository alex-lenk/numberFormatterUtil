# Описание:
numberFormatter - это мощная и гибкая библиотека для форматирования чисел на JavaScript.

## Особенности
- Поддержка различных форматов чисел.
- Функции для преобразования строк в числа и наоборот.
- Локализация и форматирование валют.

## Установка
```bash
npm i number-formatter-util
```

## Пример использования
```bash
import numberFormatter from 'number-formatter-util';

const formatter = numberFormatter({
  decimals: 0,
});
console.log(formatter(12345.678)); // Пример вывода: "12345"
console.log(formatter.to(12345.678)); // Пример вывода: "12,345.68"
console.log(formatter.from("12,345.68")); // Пример вывода: 12345.68
```

## Лицензия
Этот проект лицензирован под лицензией MIT.

## Связаться с автором
Если у вас есть вопросы или предложения, свяжитесь со мной по https://github.com/alex-lenk
