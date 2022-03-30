import { LocData } from './types.d.ts';
import sinon from "https://cdn.skypack.dev/sinon";
import { assertEquals, assertRejects } from 'https://deno.land/std@0.128.0/testing/asserts.ts';
import { fetchLocation } from './data.ts';
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

Deno.test('fetchLocation handles errors with console.log', async () => {

  const globalFetchRef = globalThis.fetch;
  const globalConsoleLogRef = globalThis.console.log;

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

  globalThis.fetch = () => Promise.reject(new Response(res));
  globalThis.console.log =  ():string => 'console.log handled error';
  

  const result = await fetchLocation();
  assertEquals(result, 'console.log handled error');

  globalThis.fetch = globalFetchRef;
  globalThis.console.log = globalConsoleLogRef  

});