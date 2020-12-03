import {ISatellite, ISatelliteLease} from "../types/model";

/**
 * Retrieves all satellites for the given host
 *
 * @param pToken AccessToken for the backend
 * @param pHostID ID of the host to search the satellites for
 */
export async function getSatellites(pToken: string, pHostID: string): Promise<ISatellite[]>
{
  return fetch("/api/satellites?host=" + pHostID, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json())
}

/**
 * Retrieves all known leases for a satellite
 *
 * @param pToken AccessToken for the backend
 * @param pSatelliteID id of the satellite
 */
export async function getLeases(pToken: string, pSatelliteID: string): Promise<ISatelliteLease[]>
{
  return fetch("/api/satellites/" + pSatelliteID + "/leases", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json())
}

/**
 * Generates a new lease for a satellite
 *
 * @param pToken AccessToken for the backend
 * @param pSatelliteID id of the satellite
 */
export async function generateLease(pToken: string, pSatelliteID: string): Promise<ISatelliteLease>
{
  return fetch("/api/satellites/" + pSatelliteID + "/leases", {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
    .then(res => res.json())
}

/**
 * Revokes a lease of a satellite
 *
 * @param pToken AccessToken for the backend
 * @param pSatelliteID id of the satellite
 * @param pLeaseID id of the lease to revoke
 */
export async function revokeLease(pToken: string, pSatelliteID: string, pLeaseID: string): Promise<any>
{
  return fetch("/api/satellites/" + pSatelliteID + "/leases/" + pLeaseID, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + pToken
    }
  })
}
