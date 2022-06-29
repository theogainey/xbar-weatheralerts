import { ColorScheme, Settings } from './types.d.ts';

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

const isValidColor = (color: string | null | undefined) =>
  typeof color === 'string' &&
  color.length === 6 && color.split('').every((digit) =>
    !isNaN(parseInt(digit, 16))
  );

const getCustomColors = (config: Settings): ColorScheme => ({
  Minor: isValidColor(config['VAR_Minor_Color'])
    ? `#${config['VAR_Minor_Color']}` ?? 'white'
    : 'white',
  Moderate: isValidColor(config['VAR_Moderate_Color'])
    ? `#${config['VAR_Moderate_Color']}` ?? 'yellow'
    : 'yellow',
  Severe: isValidColor(config['VAR_Severe_Color'])
    ? `#${config['VAR_Severe_Color']}` ?? 'red'
    : 'red',
  Extreme: isValidColor(config['VAR_Extreme_Color'])
    ? `#${config['VAR_Extreme_Color']}` ?? 'purple'
    : 'purple',
  Unknown: 'black',
});

export const getCustomColorScheme = async () => {
  try {
    const config = JSON.parse(
      await Deno.readTextFile('./alerts.1min.ts.vars.json'),
    );
    return getCustomColors(config);
  } catch {
    return {
      Minor: 'white',
      Moderate: 'yellow',
      Severe: 'red',
      Extreme: 'purple',
      Unknown: 'black',
    };
  }
};
