export interface Node
{
  kind: "node",
  icon?: string,
  id: string,
  title?: string,
  color?: string,
  x: number,
  y: number,
  slots: Slot[][],
}

export interface Slot
{
  kind: "slot",
  id: string,
  state?: SlotState,
  targetSlotID?: string,
}

export enum SlotState
{
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  DISABLED = "DISABLED"
}

export interface Point
{
  x: number,
  y: number,
}
