import { LocData, WeatherAlert } from './types.d.ts';

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
  areaDesc: alert.properties.areaDesc,
  event: alert.properties.event,
  severity: alert.properties.severity,
  status: alert.properties.status,
  headline: alert.properties.headline,
  description: alert.properties.description,
  effective: alert.properties.effective,
  ends: alert.properties.ends,
  instruction: alert.properties.instruction,
});

const extractAlerts = (
  data: { features: [{ properties: WeatherAlert }] },
): WeatherAlert[] => data.features.map((alert) => trimAlertData(alert));

/**  wrapped instance of fetch for calling location api*/
export const fetchLocation = async (): Promise<LocData> => {
  const res = await fetch('http://ipinfo.io/json');
  const data = await res.json();
  return trimLocation(data);
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
