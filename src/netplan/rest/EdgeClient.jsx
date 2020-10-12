export async function getEdges(pDeviceID)
{
  return fetch('/api/devices/' + pDeviceID + '/edges')
    .then(res => res.json());
}

export async function addEdgeBetween(pSourceID, pTargetID)
{
  return fetch('/api/devices/' + pSourceID + '/edges', {
    method: 'POST',
    body: pTargetID,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}
