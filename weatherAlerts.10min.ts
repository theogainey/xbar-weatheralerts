#!/usr/bin/env /path/to/the/deno/executable run --allow-net 
import { separator, xbar } from 'https://deno.land/x/xbar@v0.3.0/mod.ts';
import {
  fetchLocation,
  fetchNWS,
  weatherAlertsToXbarFormat,
} from 'https://raw.githubusercontent.com/theogainey/xbar-weatheralerts/main/src/index.ts';

fetchLocation()
  .then((loc) => fetchNWS(loc))
  .then((data) => weatherAlertsToXbarFormat(data))
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
