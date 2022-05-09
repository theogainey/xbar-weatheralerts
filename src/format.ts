import { separator } from 'https://deno.land/x/xbar@v0.3.0/mod.ts';
import {
  pipe,
  pipeCompatibleFilter,
} from 'https://raw.githubusercontent.com/theogainey/functional-javascript-utility-functions/main/index.js';
import { Severity, WeatherAlert, WeatherData } from './types.d.ts';

const removeLineBreaks = (text: string) =>
  text ? text.replace(/\n/g, ' ') : ' ';

const severityColors: Record<Severity, string> = {
  Minor: 'white',
  Moderate: 'yellow',
  Severe: 'red',
  Extreme: 'purple',
  Unknown: 'white',
};

const severityRankings: Record<Severity, number> = {
  Unknown: 0,
  Minor: 1,
  Moderate: 2,
  Severe: 3,
  Extreme: 4,
};

// color logic
const getColorValue = (event: WeatherAlert) => severityColors[event.severity];
const replaceWhite = (color: string) => color === 'white' ? 'black' : color;
const replaceRed = (color: string) => color === 'red' ? 'darkred' : color;
const getAlternateColorValue = (event: WeatherAlert) =>
  pipe(
    getColorValue,
    replaceWhite,
    replaceRed,
  )(event);

// filter test alerts logic
const isNotTestAlert = (event: WeatherAlert) => event.status === 'Actual';
const applyTestAlertFilter = pipeCompatibleFilter(isNotTestAlert);
const filterTestAlerts = (data: WeatherData) => ({
  ...data,
  alerts: applyTestAlertFilter(data.alerts),
});

// get and format weather alert event logic
const weatherAlertEventToXbarMenuItem = (alert: WeatherAlert) => ({
  text: alert.event,
  color: getAlternateColorValue(alert),
  size: 20,
});

// get and format weather alert details logic
const weatherAlertToXbarMenuItem = (alert: WeatherAlert) => ({
  ...weatherAlertEventToXbarMenuItem(alert),
  submenu: [
    {
      text: alert.headline,
      size: 16,
      color: 'navy',
      wordWrap: 40,
    },
    separator,
    {
      text: removeLineBreaks(alert.description),
      size: 16,
      color: 'navy',
      wordWrap: 40,
    },
    separator,
    {
      text: removeLineBreaks(alert.instruction),
      size: 16,
      color: 'navy',
      wordWrap: 40,
    },
  ],
});

// logic so that temperature color is based on most severe weather alert
const alertSeveritesToArray = (data: WeatherData) =>
  data.alerts.map((alert) => alert.severity);
const sortAlertSeverities = (arr: Severity[]) =>
  arr.sort((a, b) => severityRankings[b] - severityRankings[a]);
const getMostSevereColor = (arr: Severity[]) =>
  severityColors[arr[0]] ?? 'white';
const getTemperatureColor = (data: WeatherData) =>
  pipe(
    alertSeveritesToArray,
    sortAlertSeverities,
    getMostSevereColor,
  )(data);

const getFormattedWeatherAlerts = (data: WeatherData) =>
  data.alerts.map(weatherAlertToXbarMenuItem);

const getFormattedTemperature = (data: WeatherData) => ({
  text:
    `${data.location.city}, ${data.location.region} ${data.forecast.temperature}°${data.forecast.unit}`,
  color: getTemperatureColor(data),
});

// entry point for formatting filtered alerts
const filteredDataToXbarFormat = (data: WeatherData) => [
  getFormattedTemperature(data),
  separator,
  ...getFormattedWeatherAlerts(data),
];

// entry point
export const formatForXbar = (data: WeatherData) =>
  pipe(
    filterTestAlerts,
    filteredDataToXbarFormat,
  )(data);
