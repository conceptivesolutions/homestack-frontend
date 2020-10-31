/**
 * Executes the login for the given user with the given password
 *
 * @param pUsername Username as clear text
 * @param pPassword Password as clear text
 * @return Promise with token as result
 */
export async function login(pUsername: string, pPassword: string): Promise<string>
{
  return fetch("/api/auth/login", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      "loginId": pUsername,
      "password": pPassword,
    }),
  })
    .then(pResult => pResult.json())
    .then(pResult => pResult.token);
}
