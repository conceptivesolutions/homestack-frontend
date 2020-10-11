/**
 * Returns all devices from remote server
 *
 * @returns {Promise<Response | void>}
 */
export async function getAllDevices()
{
  return fetch('/api/devices')
    .then(res => res.json());
}

/**
 * Searches a single device with the given ID
 *
 * @param pID ID to search for
 * @returns {Promise<Response | void>}
 */
export async function getDeviceByID(pID)
{
  return fetch('/api/devices/' + pID)
    .then(res => res.json());
}

/**
 * Updates the given device on remote
 *
 * @param pID ID of the device that should be updated
 * @param pDevice Device that should be updated
 * @returns {Promise<Response | void>}
 */
export async function updateDevice(pID, pDevice)
{
  return fetch('/api/devices/' + pID, {
    method: 'PATCH',
    body: JSON.stringify(pDevice),
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  })
    .then(response => response.json());
}
