# Грунтограф

> Плагин для гранта, который типографит текст.

Он расставляет неразрывные пробелы после предлогов, союзов и коротких слов. Меняет «программистские кавычки» на ёлочки, а вложенные — на лапки. Заменяет дефис на тире, там где это нужно. Ставит короткое тире в диапазонах чисел. Cвешивает кавычки и скобки. Стилизует аббревиатуры. Ставит полупробелы в числах и перед знаками валют. Пока знает только русский язык.

## Установка

Чтобы установить грунтограф, зайдите через терминал в папку с проектом и вызовите команду:

```shell
npm install grunt-contrib-groontograf --save-dev
```

## Настройка

Пример грант-файла: 

```js
groontograf: {
  compile: {
    options: {
      hang: true,
      abbr: true,
      halfSpaces: true,
      styles: 'inline'
    },
    files: {
      'dest/good.html': 'src/bad.html'
    }
  }
}
```

| Свойство | Что делает | Значение по умолчанию |
|:---------|:-----------|:----------------------|
| `hang` | Свешивает пунктуацию | `true` |
| `abbr` | Стилизует аббревиатуры | `true` |
| `halfSpaces` | Расставляет полупробелы | `true` |
| `styles` | Определяет, куда писать стили | `inline` |

Грунтограф пишет стили в атрибут `style` элементов. Если это вам не подходит, напишите в опциях:

```js
styles: 'class',
abbrClassName: 'smallcaps',
hangClassName: ['hp_quote_space', 'hp_quote', 'hp_bracket_space', 'hp_bracket'],
halfSpaceClassName: 'halfspace'
```

Тогда вместо инлайновых стилей грунтограф пропишет классы из `hangClassName`, `abbrClassName` и `halfSpaceClassName`. Рекомендуется скачать [файл стилей](https://github.com/bespoyasov/groontograf/blob/master/product/groontograf.css), если вы не хотите прописывать стили для классов самостоятельно.

http://groontograf.bespoyasov.ru