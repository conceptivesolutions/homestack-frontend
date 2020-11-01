import jwt_decode from "jwt-decode";

/**
 * Checks, if a jwt token could be valid.
 * Does not check the signature, because the backend already does
 *
 * @param token jwt token
 */
export function isJWTTokenValid(token: string): boolean
{
  try
  {
    const {exp} = jwt_decode(token)

    // expired
    return exp >= Math.floor(Date.now() / 1000);
  } catch (err)
  {
    return false;
  }
}
