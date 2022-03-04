import { assertStrictEquals } from 'https://deno.land/std@0.128.0/testing/asserts.ts';
import { helloWorld } from './index.ts';

Deno.test('helloWorld', () => {
  const result: string = helloWorld();
  assertStrictEquals(result, 'Hello, World!');
});
