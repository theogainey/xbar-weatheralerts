export type LocData = {
  city: string;
  region: string;
  coordinates: string;
};

export type Severity = 'Minor' | 'Moderate' | 'Severe' | 'Unknown';

export type WeatherAlert = {
  areaDesc: string;
  event: string;
  severity: Severity;
  status: string;
  headline: string;
  description: string;
  effective: string;
  ends: string;
  instruction: string;
};
