import { LocData } from './types.d.ts';
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

Deno.test('fetchNWS calls NWS api with correctly formated url', async () => {
  globalThis.fetch = (params) =>
    Promise.resolve(
      new Response(
        new TextEncoder().encode(JSON.stringify({ url: `${params}` })),
      ),
    );

  const expected = {
    url: 'https://api.weather.gov/alerts/active?point=39.6464,-84.1717',
  };
  const testData: LocData = {
    city: 'Dayton',
    region: 'Ohio',
    coordinates: '39.6464,-84.1717',
  };

  const result = await fetchNWS(testData);

  assertEquals(result, expected);

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
