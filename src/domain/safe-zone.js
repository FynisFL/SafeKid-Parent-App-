export function validateSafeZoneDraft({ latitude, longitude, radiusMeters, startTime = '', endTime = '' }) {
  const latitudeText = String(latitude ?? '').trim();
  const longitudeText = String(longitude ?? '').trim();
  if (!latitudeText || !longitudeText) throw new Error('Select a location on the map or from search before saving.');
  const lat = Number(latitudeText);
  const lon = Number(longitudeText);
  const radius = Number(radiusMeters);
  if (!Number.isFinite(lat) || Math.abs(lat) > 90 || !Number.isFinite(lon) || Math.abs(lon) > 180) {
    throw new Error('The selected location is outside the valid map coordinate range.');
  }
  if (!Number.isFinite(radius) || radius < 50 || radius > 5000) {
    throw new Error('Radius must be between 50 and 5,000 metres.');
  }
  if (Boolean(startTime) !== Boolean(endTime)) throw new Error('Enter both a start and end time.');
  return { latitude: lat, longitude: lon, radiusMeters: radius };
}
