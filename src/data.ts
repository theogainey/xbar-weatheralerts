import {
  Forecast,
  LocData,
  Place,
  WeatherAlert,
  WeatherData,
} from './types.d.ts';
import { getZip } from './settings.ts';

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
  const zip = await getZip();
  if (zip) {
    const data = await useZIPCode(zip);
    return data;
  } else {
    const res = await fetch('http://ipinfo.io/json');
    const data = await res.json();
    return trimLocation(data);
  }
};

/**  wrapped instance of fetch for calling NWS api*/
export const fetchNWS = async (
  data: LocData,
): Promise<WeatherAlert[]> => {
  const res = await fetch(
    `https://api.weather.gov/alerts/active?point=${data.coordinates}`,
  );
  const nwsData = await res.json();
  return extractAlerts(nwsData);
};

const trimForcast = (
  forcast: {
    temperature: number;
    temperatureUnit: string;
    shortForecast: string;
  },
): Forecast => ({
  temperature: forcast.temperature,
  unit: forcast.temperatureUnit,
  shortForecast: forcast.shortForecast,
});
const getNearestForcast = (
  data: {
    properties: {
      periods: {
        temperature: number;
        temperatureUnit: string;
        shortForecast: string;
      }[];
    };
  },
) => trimForcast(data.properties.periods[0]);

const fetchForecast = async (location: LocData) => {
  const res1 = await fetch(
    `https://api.weather.gov/points/${location.coordinates}`,
  );
  const data1 = await res1.json();
  const res2 = await fetch(`${data1.properties.forecastHourly}`);
  const forcastData = await res2.json();
  return getNearestForcast(forcastData);
};

export const fetchWeatherData = (loc: LocData): Promise<WeatherData> =>
  Promise.all([fetchNWS(loc), fetchForecast(loc)])
    .then((values) => ({
      location: loc,
      alerts: values[0],
      forecast: values[1],
    }));
