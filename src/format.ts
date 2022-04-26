import { separator } from 'https://deno.land/x/xbar@v0.3.0/mod.ts';
import {
  pipe,
  pipeCompatibleFilter,
} from 'https://raw.githubusercontent.com/theogainey/functional-javascript-utility-functions/main/index.js';
import { Severity, WeatherAlert } from './types.d.ts';

// color logic
const severityColors: Record<Severity, string> = {
  Minor: 'white',
  Moderate: 'yellow',
  Severe: 'red',
  Unknown: 'white',
};
const getColorValue = (event: WeatherAlert) => severityColors[event.severity];

// filter test alerts logic
const isNotTestAlert = (event: WeatherAlert) => event.status === 'Actual';
const filterTestAlerts = pipeCompatibleFilter(isNotTestAlert);

// get and format weather alert event logic
const weatherAlertEventToXbarMenuItem = (alert: WeatherAlert) => ({
  text: alert.event,
  color: getColorValue(alert),
});
const getFormattedWeatherAlertEvents = (data: WeatherAlert[]) =>
  data.map(weatherAlertEventToXbarMenuItem);

// get and format weather alert details logic
const weatherAlertDetailsToXbarMenuItem = (alert: WeatherAlert) => ({
  text: alert.event,
  submenu: [
    {
      text: alert.headline,
      size: 16,
      color: 'navy',
      wordWrap: 40,
    },
    separator,
    {
      text: alert.instruction,
      size: 16,
      color: 'navy',
      wordWrap: 40,
    },
  ],
});
const getFormattedWeatherAlertDetails = (data: WeatherAlert[]) =>
  data.map(weatherAlertDetailsToXbarMenuItem);

// entry point for formatting filtered alerts
const formatForXbar = (data: WeatherAlert[]) => [
  ...getFormattedWeatherAlertEvents(data),
  separator,
  ...getFormattedWeatherAlertDetails(data),
];

// entry point
export const weatherAlertsToXbarFormat = (data: WeatherAlert[]) =>
  pipe(
    filterTestAlerts,
    formatForXbar,
  )(data);
