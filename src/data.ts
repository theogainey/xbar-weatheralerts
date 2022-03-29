import { LocData } from './types.d.ts';

/** fetchWrapper returns an instance of fetch wrapped for use with a single resource with def data and error handling */
const fetchWrapper = (url: string, dataHandler?: any, errorHandler?: any) => {
  return async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return dataHandler ? dataHandler(data) : data;
    } catch (err) {
      errorHandler ? errorHandler(err) : console.log(err);
    }
  };
};

/** trimLocation returns only the needed data fields from larger location data object*/
const trimLocation = (
  data: { city: string; region: string; loc: string },
): LocData => {
  return {
    city: data.city,
    region: data.region,
    cordinates: data.loc,
  };
};

/** fetchLocation returns an wrapped instance of fetch for calling location api */
export const fetchLocation = fetchWrapper(
  'http://ipinfo.io/json',
  trimLocation,
);
