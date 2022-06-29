import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.128.0/testing/asserts.ts';
import { getCustomColorScheme, getZip, hasValidZip } from './settings.ts';
import { Settings } from './types.d.ts';

const DenoreadTextFileRef = Deno.readTextFile;
Deno.test('hasValidZip returns false for non string values', () => {
  const caseA: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: null,
    VAR_Minor_Color: null,
    VAR_Moderate_Color: null,
    VAR_Severe_Color: null,
    VAR_Extreme_Color: null,
  };
  assert(!hasValidZip(caseA));

  const caseB: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: undefined,
    VAR_Minor_Color: null,
    VAR_Moderate_Color: null,
    VAR_Severe_Color: null,
    VAR_Extreme_Color: null,
  };
  assert(!hasValidZip(caseB));
});

Deno.test('hasValidZip returns false for string values less than 5 digits in in length', () => {
  const testCase: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: '1234',
    VAR_Minor_Color: null,
    VAR_Moderate_Color: null,
    VAR_Severe_Color: null,
    VAR_Extreme_Color: null,
  };
  assert(!hasValidZip(testCase));
});

Deno.test('hasValidZip returns false for  string values that contain non numeric characters', () => {
  const testCase: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: '1234e',
    VAR_Minor_Color: null,
    VAR_Moderate_Color: null,
    VAR_Severe_Color: null,
    VAR_Extreme_Color: null,
  };
  assert(!hasValidZip(testCase));
});

Deno.test('hasValidZip returns true for for a 5 digit string', () => {
  const testCase: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: '12345',
    VAR_Minor_Color: null,
    VAR_Moderate_Color: null,
    VAR_Severe_Color: null,
    VAR_Extreme_Color: null,
  };
  assert(hasValidZip(testCase));
});

Deno.test('getZip returns a 5 digit string', async () => {
  Deno.readTextFile = async () =>
    await JSON.stringify({
      VAR_USEZIP: true,
      VAR_ZIP: '12345',
      VAR_Minor_Color: null,
      VAR_Moderate_Color: null,
      VAR_Severe_Color: null,
      VAR_Extreme_Color: null,
    });
  const actual = await getZip();
  assertEquals(actual, '12345');
  Deno.readTextFile = DenoreadTextFileRef;
});

Deno.test('getZip returns empty string if no valid zip code is in config', async () => {
  Deno.readTextFile = async () =>
    await JSON.stringify({
      VAR_USEZIP: true,
      VAR_Minor_Color: null,
      VAR_Moderate_Color: null,
      VAR_Severe_Color: null,
      VAR_Extreme_Color: null,
    });

  const actual = await getZip();
  assertEquals(actual, '');
  Deno.readTextFile = DenoreadTextFileRef;
});

Deno.test('getZip returns empty string on file read error', async () => {
  Deno.readTextFile = () => Promise.reject(new Error());

  const actual = await getZip();
  assertEquals(actual, '');
  Deno.readTextFile = DenoreadTextFileRef;
});

Deno.test('getZip returns empty string if no config is present', async () => {
  const actual = await getZip();
  assertEquals(actual, '');
});

Deno.test('getCustomColorScheme returns default color scheme if no custom color scheme', async () => {
  Deno.readTextFile = async () =>
    await JSON.stringify({
      VAR_USEZIP: true,
      VAR_ZIP: '12345',
      VAR_Minor_Color: null,
      VAR_Moderate_Color: null,
      VAR_Severe_Color: null,
      VAR_Extreme_Color: null,
    });
  const actual = await getCustomColorScheme();
  assertEquals(actual, {
    Minor: 'white',
    Moderate: 'yellow',
    Severe: 'red',
    Extreme: 'purple',
    Unknown: 'black',
  });
  Deno.readTextFile = DenoreadTextFileRef;
});

Deno.test('getCustomColorScheme returns default color scheme on file read error ', async () => {
  Deno.readTextFile = () => Promise.reject(new Error());

  const actual = await getCustomColorScheme();
  assertEquals(actual, {
    Minor: 'white',
    Moderate: 'yellow',
    Severe: 'red',
    Extreme: 'purple',
    Unknown: 'black',
  });
  Deno.readTextFile = DenoreadTextFileRef;
});

Deno.test('getCustomColorScheme returns modified color scheme if valid color variable is in config ', async () => {
  Deno.readTextFile = async () =>
    await JSON.stringify({
      VAR_USEZIP: true,
      VAR_ZIP: '12345',
      VAR_Minor_Color: 'FFFFFF',
      VAR_Moderate_Color: null,
      VAR_Severe_Color: null,
      VAR_Extreme_Color: null,
    });
  const actual = await getCustomColorScheme();
  assertEquals(actual, {
    Minor: '#FFFFFF',
    Moderate: 'yellow',
    Severe: 'red',
    Extreme: 'purple',
    Unknown: 'black',
  });
  Deno.readTextFile = DenoreadTextFileRef;
});

Deno.test('getCustomColorScheme returns default color if color variable in config is not a 6 digit hex string', async () => {
  Deno.readTextFile = async () =>
    await JSON.stringify({
      VAR_USEZIP: true,
      VAR_ZIP: '12345',
      VAR_Minor_Color: 'ff11xy',
      VAR_Moderate_Color: null,
      VAR_Severe_Color: null,
      VAR_Extreme_Color: null,
    });
  const actual = await getCustomColorScheme();
  assertEquals(actual, {
    Minor: 'white',
    Moderate: 'yellow',
    Severe: 'red',
    Extreme: 'purple',
    Unknown: 'black',
  });
  Deno.readTextFile = DenoreadTextFileRef;
});
