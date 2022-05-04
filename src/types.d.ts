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
