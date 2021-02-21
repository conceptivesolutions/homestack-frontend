export interface ISatellite
{
  id: string,
  leases?: ISatelliteLease[],
}

export interface ISatelliteLease
{
  id: string,
  userID?: string,
  token?: string,
  revokedDate: string,
}
