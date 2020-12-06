/**
 * Executes a GET request with pre-set authorization header, if token was given
 *
 * @param url URL to fetch
 * @param token Bearer-Token for authorization - or NULL if no Header should be set
 * @constructor
 */
export function GET(url: string, token: string | null): Promise<Response>
{
  return fetch(url, {
    method: 'GET',
    headers: token === null ? {} : {
      "Authorization": "Bearer " + token
    }
  })
}

/**
 * Executes a DELETE request with pre-set authorization header, if token was given
 *
 * @param url URL to fetch
 * @param token Bearer-Token for authorization - or NULL if no Header should be set
 * @constructor
 */
export function DELETE(url: string, token: string | null): Promise<Response>
{
  return fetch(url, {
    method: 'DELETE',
    headers: token === null ? {} : {
      "Authorization": "Bearer " + token
    }
  })
}

/**
 * Executes a POST request with pre-set authorization header, if token was given
 *
 * @param url URL to fetch
 * @param token Bearer-Token for authorization - or NULL if no Header should be set
 * @param body Body to send with this request
 * @constructor
 */
export function POST(url: string, token: string | null, body?: string): Promise<Response>
{
  let headers = {
    "Content-Type": "application/json; charset=UTF-8",
  };

  return fetch(url, {
    method: 'POST',
    body,
    headers: token === null ? headers : {
      ...headers,
      "Authorization": "Bearer " + token,
    }
  })
}

/**
 * Executes a PUT request with pre-set authorization header, if token was given
 *
 * @param url URL to fetch
 * @param token Bearer-Token for authorization - or NULL if no Header should be set
 * @param body Body to send with this request
 * @constructor
 */
export function PUT(url: string, token: string | null, body?: string): Promise<Response>
{
  let headers = {
    "Content-Type": "application/json; charset=UTF-8",
  };

  return fetch(url, {
    method: 'PUT',
    body,
    headers: token === null ? headers : {
      ...headers,
      "Authorization": "Bearer " + token,
    }
  })
}
