import { Settings } from './types.d.ts';

const hasOnlyDigits = (zip: string) =>
  zip.split('').every((digit) => !isNaN(parseInt(digit)));
export const hasValidZip = (config: Settings): boolean =>
  typeof config['VAR_ZIP'] === 'string' &&
  config['VAR_ZIP'].length === 5 && hasOnlyDigits(config['VAR_ZIP']);

export const getZip = async () => {
  try {
    const config = JSON.parse(
      await Deno.readTextFile('./alerts.1min.ts.vars.json'),
    );
    if (!(config && hasValidZip(config) && config['VAR_USEZIP'])) {
      return '';
    }
    return config['VAR_ZIP'];
  } catch {
    return '';
  }
};
