import testData from './testData.json' assert { type: 'json' };
import { LocData, WeatherAlert } from './types.d.ts';
import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.128.0/testing/asserts.ts';
import { fetchLocation, fetchNWS } from './data.ts';

const globalFetchRef = globalThis.fetch;

Deno.test('fetchLocation returns only the needed data after successful request', async () => {
  const res = new TextEncoder().encode(JSON.stringify({
    ip: 'string',
    hostname: 'string',
    city: 'Dayton',
    region: 'Ohio',
    country: 'US',
    loc: '39.6464,-84.1717',
    org: 'string',
    postal: '45459',
    timezone: 'America/New_York',
  }));
  globalThis.fetch = () => Promise.resolve(new Response(res));

  const expected: LocData = {
    city: 'Dayton',
    region: 'Ohio',
    coordinates: '39.6464,-84.1717',
  };
  const result: LocData = await fetchLocation();
  assertEquals(result, expected);

  globalThis.fetch = globalFetchRef;
});

Deno.test('fetchLocation does not handle rejected Promise', async () => {
  globalThis.fetch = () => Promise.reject(new Response());

  try {
    await fetchLocation();
    assert(false);
  } catch (_err) {
    assert(true);
  }

  globalThis.fetch = globalFetchRef;
});

Deno.test('fetchNWS does not handle rejected Promise ', async () => {
  globalThis.fetch = () => Promise.resolve(new Response());

  const testData: LocData = {
    city: 'Dayton',
    region: 'Ohio',
    coordinates: '39.6464,-84.1717',
  };
  try {
    await fetchNWS(testData);
    assert(false);
  } catch (_err) {
    assert(true);
  }

  globalThis.fetch = globalFetchRef;
});

Deno.test('fetchNWS returns trimmed Weather Alert Data ', async () => {
  globalThis.fetch = () =>
    Promise.resolve(new Response(JSON.stringify(testData)));

  const expected: WeatherAlert[] = [
    {
      areaDesc:
        'Waters from Savannah GA to Altamaha Sound GA extending from 20 nm to 60 nm',
      effective: '2022-04-20T10:43:00-04:00',
      ends: '2022-04-21T08:00:00-04:00',
      status: 'Actual',
      severity: 'Minor',
      event: 'Small Craft Advisory',
      headline:
        'Small Craft Advisory issued April 20 at 10:43AM EDT until April 21 at 8:00AM EDT by NWS Charleston SC',
      description:
        '* WHAT...East winds 15 to 20 kt with gusts up to 25 kt and seas\naround 5 ft.\n\n* WHERE...Savannah to Altamaha Sound from 20 to 60 NM.\n\n* WHEN...Until 8 AM EDT Thursday.\n\n* IMPACTS...Conditions will be hazardous to small craft.',
      instruction:
        'Inexperienced mariners, especially those operating smaller\nvessels, should avoid navigating in hazardous conditions.',
    },
    {
      areaDesc:
        'Duluth MN to Port Wing WI; Port Wing to Sand Island WI; Sand Island to Bayfield WI; Outer Apostle Islands Beyond 5 NM from Mainland',
      effective: '2022-04-20T09:38:00-05:00',
      ends: '2022-04-20T16:00:00-05:00',
      status: 'Actual',
      severity: 'Minor',
      event: 'Small Craft Advisory',
      headline:
        'Small Craft Advisory issued April 20 at 9:38AM CDT until April 20 at 4:00PM CDT by NWS Duluth MN',
      description:
        '* WHAT...East winds 10 to 15 kt with gusts up to 25 kts and waves\n1 to 3 ft.\n\n* WHERE...Port Wing to Sand Island WI, Sand Island to Bayfield\nWI, Duluth MN to Port Wing WI and Outer Apostle Islands Beyond\n5 NM from Mainland.\n\n* WHEN...Until 4 PM CDT this afternoon.\n\n* IMPACTS...Conditions will be hazardous to small craft.',
      instruction:
        'Anyone operating a smaller vessel should avoid navigating in\nhazardous conditions.',
    },
  ];
  const testLoc: LocData = {
    city: 'Dayton',
    region: 'Ohio',
    coordinates: '39.6464,-84.1717',
  };

  const result: WeatherAlert[] = await fetchNWS(testLoc);
  assertEquals(result, expected);

  globalThis.fetch = globalFetchRef;
});
