export const hexToRgba = (hex: string | undefined, opacity = 1): string => {
  // Handle undefined or null hex values
  if (!hex || typeof hex !== 'string') {
    return `rgba(0, 0, 0, ${opacity})`; // Return black as fallback
  }
  
  const parsed = hex.replace('#', '');
  const bigint = parseInt(parsed.length === 3
    ? parsed.split('').map((c) => c + c).join('')
    : parsed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}