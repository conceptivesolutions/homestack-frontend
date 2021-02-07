import { ILocation } from "models/definitions/backend/common";

export interface ISatellite
{
  id: string,
  stackID?: string,
  location?: ILocation
}

export interface ISatelliteLease
{
  id: string,
  satelliteID?: string,
  userID?: string,
  token?: string,
  revokedDate: string,
}
