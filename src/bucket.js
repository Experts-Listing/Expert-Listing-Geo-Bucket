export const MIN_PRECISION = 0;
export const MAX_PRECISION = 3;

export function validateCoordinates(lat, lng) {
  const errors = [];
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) errors.push('lat must be a number between -90 and 90');
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) errors.push('lng must be a number between -180 and 180');
  return errors;
}

// Grid cell size in degrees: precision 0 = 1°, 1 = 0.1°, 2 = 0.01°, 3 = 0.001°.
export function toBucket(lat, lng, precision = 1) {
  const size = 10 ** -precision;
  const row = Math.floor(lat / size);
  const col = Math.floor(lng / size);
  const round = (n) => Number(n.toFixed(precision));

  return {
    id: `${precision}:${row}:${col}`,
    precision,
    cellSizeDegrees: size,
    bounds: {
      south: round(row * size),
      west: round(col * size),
      north: round((row + 1) * size),
      east: round((col + 1) * size),
    },
  };
}
