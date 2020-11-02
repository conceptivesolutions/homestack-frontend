import _ from "lodash";
import chars from "font-awesome-icon-chars";

/**
 * Converts an icon name to its unicode representation
 *
 * @param name name of the icon
 */
export function iconNameToUnicode(name: string): string | undefined
{
  return _.head(chars.regular.filter(pV => pV.name === name).map(pV => pV.unicode))
}
