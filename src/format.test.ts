import { WeatherAlert } from './types.d.ts';
import { assertEquals } from 'https://deno.land/std@0.128.0/testing/asserts.ts';
import { weatherAlertsToXbarFormat } from './format.ts';

Deno.test('weatherAlertsToXbarFormat returns an array with  { text: weather alert event } in the 0 index ', () => {
  const input: WeatherAlert[] = [{
    areaDesc: 'string',
    event: 'weather alert event',
    severity: 'Severe',
    status: 'Actual',
    headline: 'string',
    description: 'string',
    effective: 'string',
    ends: 'string',
    instruction: 'string',
  }];
  const actual = weatherAlertsToXbarFormat(input);
  const expected = 'weather alert event';
  assertEquals(actual[0].text, expected);
});

Deno.test('weatherAlertsToXbarFormat formats objects color field to match severity', () => {
  const input: WeatherAlert[] = [{
    areaDesc: 'string',
    event: 'weather alert event',
    severity: 'Severe',
    status: 'Actual',
    headline: 'string',
    description: 'string',
    effective: 'string',
    ends: 'string',
    instruction: 'string',
  }];
  const actual = weatherAlertsToXbarFormat(input);
  const expected = 'red';
  assertEquals(actual[0].color, expected);
});
Deno.test('weatherAlertsToXbarFormat returns an array containing only a seperator when it is passed no weather Alerts', () => {
  const input: WeatherAlert[] = [];
  const actual = weatherAlertsToXbarFormat(input);
  const expected = [{ text: '---' }];
  assertEquals(actual, expected);
});
