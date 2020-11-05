import _ from "lodash";
import * as icons from "@mdi/js";

// todo caching
// todo not via require - use webfont instead

/**
 * Returns a list of all available icons
 */
export function getIcons(): string[]
{
  return _.keys(icons);
}

/**
 * Returns the given icon as a SVG string
 *
 * @param name name of the icon
 */
export function iconToSVG(name: string): string | undefined
{
  // @ts-ignore
  return icons[name];
}

/**
 * Returns the given icon as a Path2D object for canvas drawing
 *
 * @param name name of the icon
 */
export function iconToPath2D(name: string): Path2D | undefined
{
  return new Path2D(iconToSVG(name));
}
