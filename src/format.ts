import { separator } from 'https://deno.land/x/xbar@v0.3.0/mod.ts';
import {
  pipe,
  pipeCompatibleFilter,
} from 'https://raw.githubusercontent.com/theogainey/functional-javascript-utility-functions/main/index.ts';
import { ColorScheme, Severity, WeatherAlert, WeatherData } from './types.d.ts';
import { getCustomColorScheme } from './settings.ts';

const removeLineBreaks = (text: string) =>
  text ? text.replace(/\n/g, ' ') : ' ';

const severityRankings: Record<Severity, number> = {
  Unknown: 0,
  Minor: 1,
  Moderate: 2,
  Severe: 3,
  Extreme: 4,
};

// color logic
const isDefaultColor = (color: string) => color === 'black';
const getColorValue = (colorscheme: ColorScheme) =>
  (event: WeatherAlert) => colorscheme[event.severity];
const replaceRed = (color: string) => color === 'red' ? 'darkred' : color;
const getAlternateColorValue = (colorscheme: ColorScheme) =>
  (event: WeatherAlert) =>
    pipe(
      getColorValue(colorscheme),
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
const weatherAlertEventToXbarMenuItem = (colorscheme: ColorScheme) =>
  (alert: WeatherAlert) => ({
    text: alert.event,
    color: getAlternateColorValue(colorscheme)(alert),
    size: 20,
  });

// get and format weather alert details logic
const weatherAlertToXbarMenuItem = (colorscheme: ColorScheme) =>
  (alert: WeatherAlert) => ({
    ...weatherAlertEventToXbarMenuItem(colorscheme)(alert),
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
const alertSeveritiesToArray = (data: WeatherData) =>
  data.alerts.map((alert) => alert.severity);
const sortAlertSeverities = (arr: Severity[]) =>
  arr.sort((a, b) => severityRankings[b] - severityRankings[a]);
const getMostSevereColor = (colorscheme: ColorScheme) =>
  (arr: Severity[]) => colorscheme[arr[0]] ?? 'black';

const removeColorIfDefault = (
  { text, color }: { text: string; color: string },
) => (
  isDefaultColor(color) ? { text: text } : {
    text: text,
    color: color,
  }
);

const formatTemperature = (data: WeatherData) =>
  (color: string) => ({
    text:
      `${data.location.city}, ${data.location.region} ${data.forecast.temperature}${data.forecast.unit}`,
    color: color,
  });
//getFormattedTemperature
const getFormattedTemperature = (colorscheme: ColorScheme) =>
  (data: WeatherData) =>
    pipe(
      alertSeveritiesToArray,
      sortAlertSeverities,
      getMostSevereColor(colorscheme),
      formatTemperature(data),
      removeColorIfDefault,
    )(data);

const getFormattedWeatherAlerts = (colorscheme: ColorScheme) =>
  (data: WeatherData) =>
    data.alerts.map(weatherAlertToXbarMenuItem(colorscheme));

// entry point for formatting filtered alerts
const filteredDataToXbarFormat = (colorscheme: ColorScheme) =>
  (data: WeatherData) => [
    getFormattedTemperature(colorscheme)(data),
    separator,
    ...getFormattedWeatherAlerts(colorscheme)(data),
  ];

// entry point
export const formatForXbar = async (data: WeatherData) => {
  const colorscheme: ColorScheme = await getCustomColorScheme();
  return pipe(
    filterTestAlerts,
    filteredDataToXbarFormat(colorscheme),
  )(data);
};
