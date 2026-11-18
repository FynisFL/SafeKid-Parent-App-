const EARTH_RADIUS_METERS = 6371008.8;
const RADIANS_PER_DEGREE = Math.PI / 180;

export function makeGeoCircle(longitude, latitude, radiusMeters, steps = 64) {
  const centerLatitude = latitude * RADIANS_PER_DEGREE;
  const centerLongitude = longitude * RADIANS_PER_DEGREE;
  const angularRadius = radiusMeters / EARTH_RADIUS_METERS;
  const ring = [];

  for (let i = 0; i <= steps; i++) {
    const bearing = 2 * Math.PI * i / steps;
    const pointLatitude = Math.asin(
      Math.sin(centerLatitude) * Math.cos(angularRadius)
      + Math.cos(centerLatitude) * Math.sin(angularRadius) * Math.cos(bearing),
    );
    const pointLongitude = centerLongitude + Math.atan2(
      Math.sin(bearing) * Math.sin(angularRadius) * Math.cos(centerLatitude),
      Math.cos(angularRadius) - Math.sin(centerLatitude) * Math.sin(pointLatitude),
    );
    ring.push([pointLongitude / RADIANS_PER_DEGREE, pointLatitude / RADIANS_PER_DEGREE]);
  }

  return { type: 'Polygon', coordinates: [ring] };
}
