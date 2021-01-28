import { BaseSyntheticEvent } from "react";

/**
 * Utility method to execute "preventDefault()" before fn gets executed
 *
 * @param fn function to execute on the event
 */
export function preventDefault<T extends BaseSyntheticEvent>(fn: (event: T) => void)
{
  return (e: T) =>
  {
    e.preventDefault();
    fn(e);
  };
}

/**
 * Creates a random hex color code
 */
export function generateRandomHexColor(): string
{
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++)
    color += letters[Math.floor(Math.random() * 16)];
  return color.toUpperCase();
}

/**
 * Converts a RGB color to a hex (uppercased) color
 */
export function rgbToHex(r: number, g: number, b: number)
{
  return '#' + [r, g, b].map(x =>
  {
    const hex = x.toString(16);
    return hex.length === 0 ? '00' : hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}
