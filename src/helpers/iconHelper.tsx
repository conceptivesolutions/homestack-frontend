import _ from "lodash";
import { homeAutomationIcons, networkIcons } from "./iconPack";

/**
 * Returns a list of all available icons
 */
export function getIcons(): string[]
{
  return _.sortBy(_.concat(_.keys(homeAutomationIcons), _.keys(networkIcons)));
}

/**
 * Returns the given icon as a SVG string
 *
 * @param name name of the icon
 */
export function iconToSVG(name: string): string | undefined
{
  return homeAutomationIcons[name] || networkIcons[name];
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
