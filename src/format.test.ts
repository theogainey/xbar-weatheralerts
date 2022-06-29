import { WeatherAlert, WeatherData } from './types.d.ts';
import { assertEquals } from 'https://deno.land/std@0.128.0/testing/asserts.ts';
import { formatForXbar } from './format.ts';

Deno.test('weatherAlertsToXbarFormat returns an array with  { text: weather alert event } in the 0 index ', async () => {
  const alerts: WeatherAlert[] = [{
    event: 'weather alert event',
    severity: 'Severe',
    status: 'Actual',
    headline: 'string',
    description: 'string',
    instruction: 'string',
  }];

  const input: WeatherData = {
    location: {
      city: 'city',
      region: 'region',
      coordinates: 'string',
    },
    alerts: alerts,
    forecast: {
      temperature: 20,
      unit: 'F',
      shortForecast: 'string',
    },
  };
  const actual = await formatForXbar(input);
  const expected = 'weather alert event';
  assertEquals(actual[2].text, expected);
});

Deno.test('weatherAlertsToXbarFormat formats objects color field to match severity', async () => {
  const alerts: WeatherAlert[] = [{
    event: 'weather alert event',
    severity: 'Severe',
    status: 'Actual',
    headline: 'string',
    description: 'string',
    instruction: 'string',
  }];

  const input: WeatherData = {
    location: {
      city: 'city',
      region: 'region',
      coordinates: 'string',
    },
    alerts: alerts,
    forecast: {
      temperature: 20,
      unit: 'F',
      shortForecast: 'string',
    },
  };
  const actual = await formatForXbar(input);
  const expected = 'darkred';
  assertEquals(actual[2].color, expected);
});
