import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.128.0/testing/asserts.ts';
import { getZip, hasValidZip } from './settings.ts';
import { Settings } from './types.d.ts';

const DenoreadTextFileRef = Deno.readTextFile;
Deno.test('hasValidZip returns false for non string values', () => {
  const caseA: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: null,
  };
  assert(!hasValidZip(caseA));

  const caseB: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: undefined,
  };
  assert(!hasValidZip(caseB));
});

Deno.test('hasValidZip returns false for string values less than 5 digits in in length', () => {
  const testCase: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: '1234',
  };
  assert(!hasValidZip(testCase));
});

Deno.test('hasValidZip returns false for  string values that contain non numeric characters', () => {
  const testCase: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: '1234e',
  };
  assert(!hasValidZip(testCase));
});

Deno.test('hasValidZip returns true for for a 5 digit string', () => {
  const testCase: Settings = {
    VAR_USEZIP: true,
    VAR_ZIP: '12345',
  };
  assert(hasValidZip(testCase));
});

Deno.test('getZip returns a 5 digit string', async () => {
  Deno.readTextFile = async () =>
    await JSON.stringify({
      VAR_USEZIP: true,
      VAR_ZIP: '12345',
    });
  const actual = await getZip();
  assertEquals(actual, '12345');
  Deno.readTextFile = DenoreadTextFileRef;
});

Deno.test('getZip returns empty string if no valid zip code is in config', async () => {
  Deno.readTextFile = async () =>
    await JSON.stringify({
      VAR_USEZIP: true,
    });

  const actual = await getZip();
  assertEquals(actual, '');
  Deno.readTextFile = DenoreadTextFileRef;
});

Deno.test('getZip returns empty string if no config is present', async () => {
  const actual = await getZip();
  assertEquals(actual, '');
});
