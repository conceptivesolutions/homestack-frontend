export interface Node
{
  kind: "node",
  icon?: string,
  id: string,
  title?: string,
  color?: string,
  x: number,
  y: number,
  slots: {
    x: number,
    y: number,
    data: Slot[],
  }
}

export interface Edge
{
  kind: "edge",
  from: string,
  from_slotID: number,
  to: string,
  to_slotID: number,
}

export interface Slot
{
  kind: "slot",
  id: string,
  state: SlotState,
}

export enum SlotState
{
  UP = "UP",
  DOWN = "DOWN",
  EMPTY = "EMPTY"
}

export interface Point
{
  x: number,
  y: number,
}
