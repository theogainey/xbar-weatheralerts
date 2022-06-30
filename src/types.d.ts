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
  temperature: number | string;
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
  VAR_Minor_Color: string | null | undefined;
  VAR_Moderate_Color: string | null | undefined;
  VAR_Severe_Color: string | null | undefined;
  VAR_Extreme_Color: string | null | undefined;
  LastCity: string | null | undefined;
  LastRegion: string | null | undefined;
  LastCoordinates: string | null | undefined;
  LastAlerts: WeatherAlert[] | null | undefined;
};

export type ColorScheme = {
  Minor: string;
  Moderate: string;
  Severe: string;
  Extreme: string;
  Unknown: string;
};

export type Place = {
  'place name': string;
  longitude: string;
  latitude: string;
  state: string;
};
