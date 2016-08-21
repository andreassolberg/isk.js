# ISK.js

Get a currency data from icelandic

## Instal


```
npm i isk.js
```

## Usage

getData(year, month, day)

* Year: in example: 2016
* Month (1 - 12)
* Day (1 - 31)

Returns a Promise.


```
var ISK = require('./ISK').ISK;
var x = new ISK();
x.getData(2016, 7, 10)
    .then(function(data) {
        console.log("--- data ");
        console.log(data);

    })
    .catch(function(err) {
        console.error("---- ERROR ----");
        console.error(err.stack);
    });
```


Data structure:

```
{ USD: { buy: 116.33, sell: 116.89, mid: 116.61 },
  GBP: { buy: 152.72, sell: 153.46, mid: 153.09 },
  CAD: { buy: 90.73, sell: 91.27, mid: 91 },
  DKK: { buy: 17.696, sell: 17.8, mid: 17.748 },
  NOK: { buy: 14.13, sell: 14.214, mid: 14.172 },
  SEK: { buy: 13.878, sell: 13.96, mid: 13.919 },
  CHF: { buy: 121.47, sell: 122.15, mid: 121.81 },
  JPY: { buy: 1.161, sell: 1.1678, mid: 1.1644 },
  XDR: { buy: 163.43, sell: 164.41, mid: 163.92 },
  EUR: { buy: 131.71, sell: 132.45, mid: 132.08 },
  'Broad merchandise index': { buy: null, sell: null, mid: 160.4964 },
  'Narrow merchandise index': { buy: null, sell: null, mid: 163.1404 },
  'Broad trade index': { buy: null, sell: null, mid: 164.3163 },
  'Narrow trade index': { buy: null, sell: null, mid: 166.1722 },
  'Narrow trade index*': { buy: null, sell: null, mid: 176.2359 } }
```
