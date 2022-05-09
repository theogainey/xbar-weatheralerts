#!/usr/bin/env /path/to/the/deno/executable run --allow-net 
import { separator, xbar } from 'https://deno.land/x/xbar@v0.3.0/mod.ts';
import { fetchLocation, fetchWeatherData } from './src/data.ts';
import { formatForXbar } from './src/format.ts';

fetchLocation()
  .then((loc) => fetchWeatherData(loc))
  .then((data) => formatForXbar(data))
  .then((alerts) => xbar(alerts))
  .catch((err) =>
    xbar([
      {
        text: 'error',
      },
      separator,
      {
        text: err,
      },
    ])
  );