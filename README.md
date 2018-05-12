# LaMetric-USGasPrices

## Description
The backend of the [US Average Gas Prices](https://apps.lametric.com/apps/us_average_gas_prices/3918) app for the [LaMetric Time](https://lametric.com/).

## Instructions
- Get an api 
- Modify the index.js based off the api you use.
- Install node (last checked with v6.x.x)
- Enjoy

**Note:** This is fairly bare bones, only retrives basic info from api.

**Note**: This was based off AAA's website for gas prices.

## Crontab setup

``` 
crontab -e
```

```
0 */12 * * * cd /path/to/your/folder && node index.js
```

## GDPR
- This app does not collect any user identifiable data. ``... but you already knew that.``