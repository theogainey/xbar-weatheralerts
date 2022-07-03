import {
  ColorScheme,
  LocData,
  Settings,
  WeatherAlert,
  WritableValues,
} from './types.d.ts';

const hasOnlyDigits = (zip: string) =>
  zip.split('').every((digit) => !isNaN(parseInt(digit)));
export const hasValidZip = (config: Settings): boolean =>
  typeof config['VAR_ZIP'] === 'string' &&
  config['VAR_ZIP'].length === 5 && hasOnlyDigits(config['VAR_ZIP']);

const getConfig = async () => {
  for await (const dirEntry of Deno.readDir(Deno.cwd())) {
    if (
      dirEntry.name.slice(0, 13) === 'weatherAlerts' &&
      dirEntry.name.slice(-9) === 'vars.json'
    ) {
      return JSON.parse(
        await Deno.readTextFile(`./${dirEntry.name}`),
      );
    }
  }
};

export const getZip = async () => {
  try {
    const config = await getConfig();
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
    const config = await getConfig();
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

const isValidCoordinates = (coordinates: string | null | undefined) =>
  typeof coordinates === 'string' &&
  coordinates.trim().split(',').every((e) => e.length === 8 || e.length === 7);

const extractLocation = (config: Settings) => ({
  city: config['LastCity'] ?? '',
  region: config['LastRegion'] ?? '',
  coordinates: isValidCoordinates(config['LastCoordinates'])
    ? config['LastCoordinates'] ?? ''
    : '',
});
export const getLastLocation = async () => {
  try {
    const config = await getConfig();
    return extractLocation(config);
  } catch {
    return {
      city: '',
      region: '',
      coordinates: '',
    };
  }
};

export const getLastAlerts = async (): Promise<WeatherAlert[]> => {
  try {
    const config = await getConfig();
    if (config && config['lastAlerts']) {
      return config['lastAlerts'];
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

const writeConfig = (config: Settings, values: WritableValues) => {
  for (const dirEntry of Deno.readDirSync(Deno.cwd())) {
    if (
      dirEntry.name.slice(0, 6) === 'weatherAlerts' &&
      dirEntry.name.slice(-9) == 'vars.json'
    ) {
      Deno.writeTextFile(
        `./${dirEntry.name}`,
        JSON.stringify(
          {
            ...config,
            ...values,
          },
          null,
          2,
        ),
      );
    }
  }
};
export const writeLocation = async (location: LocData): Promise<void> => {
  try {
    const config = await getConfig();
    writeConfig(config, {
      LastCity: location.city,
      LastRegion: location.region,
      LastCoordinates: location.coordinates,
    });
  } catch {
    return;
  }
};

export const writeAlerts = async (
  alerts: WeatherAlert[] = [],
): Promise<void> => {
  try {
    const config = await getConfig();
    writeConfig(config, {
      lastAlerts: alerts,
    });
  } catch {
    return;
  }
};
