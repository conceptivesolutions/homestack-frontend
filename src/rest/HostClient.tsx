import {IHost} from "../types/model";
import {v4 as uuidv4} from 'uuid';

/**
 * Retrieves all hosts for the currently logged in user
 *
 * @param pToken AccessToken for the backend
 */
export async function getHosts(pToken: string): Promise<IHost[]>
{
  return fetch('/api/hosts/', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json());
}

/**
 * Creates a new host for the currently logged in user
 *
 * @param pToken AccessToken for the backend
 * @param pHost Host that should be created (optional)
 */
export async function createHost(pToken: string, pHost?: IHost): Promise<IHost>
{
  const host = pHost || {
    id: uuidv4(),
  }
  return fetch('/api/hosts/' + host.id, {
    method: 'PUT',
    body: JSON.stringify(host),
    headers: {
      "Authorization": "Bearer " + pToken,
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json());
}

/**
 * Updates a given host
 *
 * @param pToken AccessToken for the backend
 * @param pHost Host that should be updated (containing the updated values and ID)
 */
export async function updateHost(pToken: string, pHost: IHost): Promise<IHost>
{
  return fetch('/api/hosts/' + pHost.id, {
    method: 'PATCH',
    body: JSON.stringify(pHost),
    headers: {
      "Authorization": "Bearer " + pToken,
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json());
}
