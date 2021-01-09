import {Edge, Node, SlotState} from "components/graph/NetworkComponentModel";
import {IRenderInfo} from "components/graph/renderer/IRenderInfo";
import {iconToPath2D} from "helpers/iconHelper";
import _ from "lodash";

/**
 * Renders the information in the renderInfo object to the canvas given in the object
 *
 * @param info information object with all in it
 */
export function render(info: IRenderInfo)
{
  const canvas = info.canvasRef?.current;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx)
    return;

  // reset, clear the current view and apply viewport translation, so that 0,0 will be centered
  _initContext(ctx, info, canvas.clientWidth, canvas.clientHeight);
  _initContext(info.rdcRef.current.ctx, info, canvas.clientWidth, canvas.clientHeight);

  // render grid
  _renderGrid(ctx, info);

  // render data
  _.forEach(info.data.nodes, pNode => _renderNode(ctx, info, pNode));
  _.forEach(info.data.edges, pEdges => pEdges.forEach(pEdge => _renderEdge(ctx, info, pEdge)));

  // render debug stuff, if we should do it
  if (!!info.debug?.enabled)
    _renderDebug(ctx, info);
}

/**
 * Initializes the given context for rendering a single frame
 *
 * @param ctx context to initialize
 * @param info data
 * @param clientWidth width
 * @param clientHeight height
 */
function _initContext(ctx: CanvasRenderingContext2D, info: IRenderInfo, clientWidth: number, clientHeight: number)
{
  // correct canvas size to match its client size
  ctx.canvas.width = clientWidth;
  ctx.canvas.height = clientHeight;

  // reset, clear the current view and apply viewport translation, so that 0,0 will be centered
  ctx.resetTransform()
  ctx.scale(info.zoom, info.zoom);
  ctx.clearRect(0, 0, clientWidth, clientHeight);
  ctx.translate(info.viewport.x + ((clientWidth / 2) / info.zoom), (info.viewport.y + ((clientHeight / 2) / info.zoom)))
}

/**
 * Renders the background grid on the canvas context
 *
 * @param ctx context to render on
 * @param info render info
 */
function _renderGrid(ctx: CanvasRenderingContext2D, info: IRenderInfo)
{
  const size = 10; // space between the lines
  const boldLine = 5; // number to declare, which n-th line should be "bold"
  const normalColor = '#f0f0f0';
  const boldColor = '#e2e2e2';

  let width = ctx.canvas.width / info.zoom;
  let height = ctx.canvas.height / info.zoom;
  let gridSteps = 1;

  let minGridX = Math.floor(((-info.viewport.x) - (width / 2)) / size);
  let minGridY = Math.floor(((-info.viewport.y) - (height / 2)) / size);
  let gridCountX = Math.ceil(width / size) + 1;
  let gridCountY = Math.ceil(height / size) + 1;

  // draw columns
  for (let currGridCountX = minGridX % 2; currGridCountX < gridCountX; currGridCountX += gridSteps)
  {
    let lineX = (minGridX + currGridCountX) * size;
    let lineY = minGridY * size;
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(lineX, lineY + (gridCountY * size));
    ctx.strokeStyle = (minGridX + currGridCountX) % (boldLine * gridSteps) === 0 ? boldColor : normalColor;
    ctx.stroke();
  }

  // draw rows
  for (let currGridCountY = minGridY % 2; currGridCountY < gridCountY; currGridCountY += gridSteps)
  {
    let lineX = minGridX * size;
    let lineY = (minGridY + currGridCountY) * size;
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(lineX + (gridCountX * size), lineY);
    ctx.strokeStyle = (minGridY + currGridCountY) % (boldLine * gridSteps) === 0 ? boldColor : normalColor;
    ctx.stroke();
  }
}

/**
 * Renders a single node onto a canvas context
 *
 * @param ctx context to render on
 * @param info render info
 * @param node node to render
 */
function _renderNode(ctx: CanvasRenderingContext2D, info: IRenderInfo, node: Node)
{
  const iconSize = 50;
  const padding = 5; // vertical padding
  const edgeSlotSize = 12; // size of a single edge slot rectangle
  const edgeSlotPadding = 4; // padding between slots
  const edgeAmountX = node.slots.x;
  const edgeAmountY = node.slots.y;
  const edgeSlotsHeight = edgeAmountY * edgeSlotSize + (edgeAmountY - 1) * edgeSlotPadding;

  // Font
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  const oldTransform = ctx.getTransform();

  // Draw Icon
  if (!!node.icon)
  {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.transform(2, 0, 0, 2, node.x - (iconSize / 2), node.y - (iconSize / 2))
    ctx.fillStyle = node.color || "black";
    ctx.fill(iconToPath2D(node.icon)!)
    ctx.setTransform(oldTransform);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw Icon Region
    info.rdcRef.current?.render(node, (color, ctx) => ctx.fillRect(node.x - (iconSize / 2), node.y - (iconSize / 2), iconSize, iconSize));
  }

  // Draw Edge Slot Backgrounds
  for (let slotID = 0; slotID < edgeAmountX * edgeAmountY; slotID++)
  {
    ctx.fillStyle = "#d7d7d7"
    const slotPadding = 1;
    const slot = _getEdgeSlot(node, slotID)
    ctx.fillRect(slot.x + slotPadding, slot.y + slotPadding, slot.width - 2 * slotPadding, slot.height - 2 * slotPadding);
  }

  // Draw Title
  if (!!node.title)
  {
    ctx.fillStyle = "black";
    ctx.textBaseline = "top"
    ctx.textAlign = "center"
    ctx.font = "10pt monospace"
    ctx.fillText(node.title, node.x, node.y + (iconSize / 2) + padding + edgeSlotsHeight + padding);
    ctx.setTransform(oldTransform);
  }
}

/**
 * Renders a single edge onto a canvas context
 *
 * @param ctx context to render on
 * @param info render info
 * @param edge edge to render
 */
function _renderEdge(ctx: CanvasRenderingContext2D, info: IRenderInfo, edge: Edge)
{
  if (!info.data.nodes)
    return;

  const from = info.data.nodes[edge.from];
  const to = info.data.nodes[edge.to]
  if (!from || !to)
    return;

  const fromSlot = _getEdgeSlot(from, edge.from_slotID)
  const toSlot = _getEdgeSlot(to, edge.to_slotID)

  // Draw Edge
  ctx.strokeStyle = "#a0a0a0"
  ctx.setLineDash([5])
  ctx.beginPath();
  ctx.moveTo(fromSlot.x + (fromSlot.width / 2), fromSlot.y + (fromSlot.height / 2))
  ctx.lineTo(toSlot.x + (toSlot.width / 2), toSlot.y + (toSlot.height / 2));
  ctx.stroke();

  // Draw Slot Colors
  ctx.fillStyle = _.nth(from.slots.states, edge.from_slotID) === SlotState.UP ? "#dd0404" : "#4bbf04";
  ctx.fillRect(fromSlot.x, fromSlot.y, fromSlot.width, fromSlot.height);
  ctx.fillStyle = _.nth(to.slots.states, edge.to_slotID) === SlotState.UP ? "#dd0404" : "#4bbf04";
  ctx.fillRect(toSlot.x, toSlot.y, toSlot.width, toSlot.height);
}

/**
 * Returns the rectangle for a given slot id for an edge
 *
 * @param node node to get the slot for
 * @param slotID id of the slot
 */
function _getEdgeSlot(node: Node, slotID: number): { x: number, y: number, width: number, height: number }
{
  const iconSize = 50;
  const padding = 5; // vertical padding
  const edgeSlotSize = 12; // size of a single edge slot rectangle
  const edgeSlotPadding = 4; // padding between slots
  const edgeAmountX = node.slots.x;
  const edgeSlotsWidth = edgeAmountX * edgeSlotSize + (edgeAmountX - 1) * edgeSlotPadding;
  const edgeX = slotID % edgeAmountX;
  const edgeY = Math.floor(slotID / edgeAmountX);

  return {
    x: node.x - (edgeSlotsWidth / 2) + (edgeX * edgeSlotSize) + (edgeX * edgeSlotPadding),
    y: node.y + padding + (iconSize / 2) + (edgeY * edgeSlotSize) + (edgeY * edgeSlotPadding),
    width: edgeSlotSize,
    height: edgeSlotSize
  }
}

/**
 * Renders all debug stuff
 *
 * @param ctx context to render on
 * @param info information to render
 */
function _renderDebug(ctx: CanvasRenderingContext2D, info: IRenderInfo)
{
  const oldAlpha = ctx.globalAlpha;
  ctx.globalAlpha = 0.5;

  // render rdc
  ctx.resetTransform();
  ctx.drawImage(info.rdcRef.current.canvas, 0, 0);

  // render click
  if (!!info.debug?.clickPoint)
  {
    ctx.fillStyle = "red"
    ctx.strokeStyle = "black"
    ctx.setLineDash([])
    ctx.beginPath();
    ctx.moveTo(info.debug.clickPoint.x - 10, info.debug.clickPoint.y);
    ctx.lineTo(info.debug.clickPoint.x + 10, info.debug.clickPoint.y);
    ctx.moveTo(info.debug.clickPoint.x, info.debug.clickPoint.y - 10);
    ctx.lineTo(info.debug.clickPoint.x, info.debug.clickPoint.y + 10);
    ctx.stroke();
  }

  // reset alpha
  ctx.globalAlpha = oldAlpha;
}
