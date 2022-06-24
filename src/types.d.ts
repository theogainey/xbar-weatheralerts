export type LocData = {
  city: string;
  region: string;
  coordinates: string;
};

export type Severity = 'Minor' | 'Moderate' | 'Severe' | 'Extreme' | 'Unknown';

export type WeatherAlert = {
  event: string;
  severity: Severity;
  status: string;
  headline: string;
  description: string;
  instruction: string;
};

export type Forecast = {
  temperature: number;
  unit: string;
  shortForecast: string;
};

export type WeatherData = {
  location: LocData;
  alerts: WeatherAlert[];
  forecast: Forecast;
};

export type Settings = {
  VAR_USEZIP: boolean | null | undefined;
  VAR_ZIP: string | null | undefined;
};

export type Place = {
  'place name': string;
  longitude: string;
  latitude: string;
  state: string;
};
