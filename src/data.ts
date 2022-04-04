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

/**  wrapped instance of fetch for calling location api*/
export const fetchLocation = async (): Promise<void | LocData> => {
  try {
    const res = await fetch('http://ipinfo.io/json');
    const data = await res.json();
    return trimLocation(data);
  } catch (err) {
    return console.log(err);
  }
};

/**  wrapped instance of fetch for calling NWS api*/
export const fetchNWS = async (
  data: LocData | void,
) => {
  if (data) {
    try {
      const res = await fetch(
        `https://api.weather.gov/alerts/active?point=${data.coordinates}`,
      );
      const nwsData = await res.json();
      return nwsData;
    } catch (err) {
      return console.log(err);
    }
  }
};
