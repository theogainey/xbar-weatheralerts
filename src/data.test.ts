import { LocData } from './types.d.ts';
import { assertEquals } from 'https://deno.land/std@0.128.0/testing/asserts.ts';
import { fetchLocation } from './data.ts';
Deno.test('fetchLocation', async () => {
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

  const globalFetchRef = globalThis.fetch;
  globalThis.fetch = () => Promise.resolve(new Response(res));

  const expected: LocData = {
    city: 'Dayton',
    region: 'Ohio',
    cordinates: '39.6464,-84.1717',
  };
  const result: LocData = await fetchLocation();
  assertEquals(result, expected);

  globalThis.fetch = globalFetchRef;
});
