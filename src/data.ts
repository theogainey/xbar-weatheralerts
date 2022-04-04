import { LocData } from './types.d.ts';

/** trimLocation returns only the needed data fields from larger location data object*/
const trimLocation = (
  data: { city: string; region: string; loc: string },
): LocData => {
  return {
    city: data.city,
    region: data.region,
    coordinates: data.loc,
  };
};

/**  wrapped instance of fetch for calling location api handles errors with console.log*/
export const fetchLocation = async (): Promise<void | LocData> => {
  try {
    const res = await fetch('http://ipinfo.io/json');
    const data = await res.json();
    return trimLocation(data);
  } catch (err) {
    return console.log(err);
  }
};
