/**
 * Capitalizes the first letter of a given string.
 */
export function capitalizeFirstLetter(string: string | undefined): string {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}
