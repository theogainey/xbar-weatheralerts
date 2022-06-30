import {
  Forecast,
  LocData,
  Place,
  WeatherAlert,
  WeatherData,
} from './types.d.ts';
import {
  getLastAlerts,
  getLastLocation,
  getZip,
  writeAlerts,
  writeLocation,
} from './settings.ts';

/** trimLocation returns only the needed data fields from larger location data object*/
const trimLocation = (
  data: { city: string; region: string; loc: string },
): LocData => ({
  city: data.city,
  region: data.region,
  coordinates: data.loc,
});

/** trimAlertData returns only the needed data fields from larger location data object*/
const trimAlertData = (alert: { properties: WeatherAlert }): WeatherAlert => ({
  event: alert.properties.event,
  severity: alert.properties.severity,
  status: alert.properties.status,
  headline: alert.properties.headline,
  description: alert.properties.description,
  instruction: alert.properties.instruction,
});

const extractAlerts = (
  data: { features: [{ properties: WeatherAlert }] },
): WeatherAlert[] => data.features.map((alert) => trimAlertData(alert));

const toLocData = (place: Place) => ({
  city: place['place name'],
  region: place['state'],
  coordinates: `${place['latitude']},${place['longitude']}`,
});

const useZIPCode = async (zip: string): Promise<LocData> => {
  const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
  const data = await res.json();
  return toLocData(data.places[0]);
};

/**  wrapped instance of fetch for calling location api*/
export const fetchLocation = async (): Promise<LocData> => {
  try {
    const zip = await getZip();
    if (zip) {
      const data = await useZIPCode(zip);
      // write data
      writeLocation(data);
      return data;
    } else {
      const res = await fetch('http://ipinfo.io/json');
      const data = trimLocation(await res.json());
      // write data
      writeLocation(data);
      return data;
    }
  } catch {
    return await getLastLocation();
  }
};

/**  wrapped instance of fetch for calling NWS api*/
export const fetchNWS = async (
  data: LocData,
): Promise<WeatherAlert[]> => {
  try {
    const res = await fetch(
      `https://api.weather.gov/alerts/active?point=${data.coordinates}`,
    );
    const nwsData = extractAlerts(await res.json());
    writeAlerts(nwsData);
    return nwsData;
  } catch {
    return await getLastAlerts();
  }
};

const trimForecast = (
  forecast: {
    temperature: number;
    temperatureUnit: string;
    shortForecast: string;
  },
): Forecast => ({
  temperature: forecast.temperature,
  unit: `°${forecast.temperatureUnit}`,
  shortForecast: forecast.shortForecast,
});
const getNearestForecast = (
  data: {
    properties: {
      periods: {
        temperature: number;
        temperatureUnit: string;
        shortForecast: string;
      }[];
    };
  },
) => trimForecast(data.properties.periods[0]);

const fetchForecast = async (location: LocData) => {
  try {
    const res1 = await fetch(
      `https://api.weather.gov/points/${location.coordinates}`,
    );
    const data1 = await res1.json();
    const res2 = await fetch(`${data1.properties.forecastHourly}`);
    const forecastData = await res2.json();
    return getNearestForecast(forecastData);
  } catch {
    return {
      temperature: '',
      unit: '',
      shortForecast: '',
    };
  }
};

export const fetchWeatherData = (loc: LocData): Promise<WeatherData> =>
  Promise.all([fetchNWS(loc), fetchForecast(loc)])
    .then((values) => ({
      location: loc,
      alerts: values[0],
      forecast: values[1],
    }));
