export async function getMetrics(pDeviceID)
{
  return fetch('/api/metrics/' + pDeviceID)
    .then(res => res.json());
}
