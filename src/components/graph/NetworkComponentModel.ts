export interface Node
{
  icon?: string,
  id: string,
  title?: string,
  color?: string,
  x: number,
  y: number,
  slots: {
    x: number,
    y: number,
    states?: SlotState[],
  }
}

export enum SlotState
{
  UP = "UP",
  DOWN = "DOWN",
}

export interface Edge
{
  from: string,
  from_slotID: number,
  to: string,
  to_slotID: number,
}

export interface Point
{
  x: number,
  y: number,
}
