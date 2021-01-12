import {mdiCheckboxBlankOutline, mdiCheckboxMarked} from "@mdi/js";
import {Edge, Node, Point, Slot, SlotState} from "components/graph/NetworkComponentModel";
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

  // update renderinfo for next render instance
  info.frameRenderInfo = {
    frameSize: {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    }
  }
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

  // update viewport, if canvas was resized
  if (!!info.frameRenderInfo && !!info.frameRenderInfo.frameSize &&
    (info.frameRenderInfo.frameSize.width !== clientWidth || info.frameRenderInfo.frameSize.height !== clientHeight))
  {
    // align new viewport to top-left-corner
    info.viewport.x += (info.frameRenderInfo.frameSize.width - clientWidth) / (4 * info.zoom)
    info.viewport.y += (info.frameRenderInfo.frameSize.height - clientHeight) / (4 * info.zoom)
  }

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
  const nodeX = node.x + (info.dragging?.object === node ? info.dragging.change.x : 0);
  const nodeY = node.y + (info.dragging?.object === node ? info.dragging.change.y : 0);
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
    ctx.transform(2, 0, 0, 2, nodeX - (iconSize / 2), nodeY - (iconSize / 2))
    ctx.fillStyle = node.color || "black";
    ctx.fill(iconToPath2D(node.icon)!)
    ctx.setTransform(oldTransform);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw Icon Region
    info.rdcRef.current?.render(node, (color, ctx) => ctx.fillRect(nodeX - (iconSize / 2), nodeY - (iconSize / 2), iconSize, iconSize));
  }

  // Draw Selection State
  const isSelected = node.id === info.selection?.object?.id || _.isEqual(node, info.selection?.object);
  const selectionSize = 0.7;
  ctx.transform(selectionSize, 0, 0, selectionSize, nodeX - (iconSize / 2) - 7, nodeY - (iconSize / 2) - 7);
  ctx.fillStyle = isSelected ? "#14bae4" : "#d7d7d7";
  ctx.fill(new Path2D(isSelected ? mdiCheckboxMarked : mdiCheckboxBlankOutline))
  ctx.setTransform(oldTransform);
  info.rdcRef.current?.render(node, (color, ctx) => ctx.fillRect(nodeX - (iconSize / 2) - 7, nodeY - (iconSize / 2) - 7, 17, 17))

  // Draw Edge Slot Backgrounds
  for (let slotID = 0; slotID < edgeAmountX * edgeAmountY; slotID++)
    _renderSlotBackground(ctx, info, node, slotID);

  // Draw Title
  if (!!node.title)
  {
    ctx.fillStyle = "black";
    ctx.textBaseline = "top"
    ctx.textAlign = "center"
    ctx.font = "10pt monospace"
    ctx.fillText(node.title, nodeX, nodeY + (iconSize / 2) + padding + edgeSlotsHeight + padding);
    ctx.setTransform(oldTransform);
  }
}

/**
 * Renders the slot background for the slot with the given ID
 *
 * @param ctx context to render on
 * @param info render information
 * @param node slots node
 * @param slotID id of the slot to render
 */
function _renderSlotBackground(ctx: CanvasRenderingContext2D, info: IRenderInfo, node: Node, slotID: number)
{
  const slotPadding = 1;
  const slotRect = _calculateSlotRect(info, node, slotID, false)
  const slot = _.nth(node.slots?.data, slotID);
  ctx.fillStyle = "#a0a0a0"
  ctx.strokeStyle = "#a0a0a0"
  if (!!slot)
  {
    ctx.strokeRect(slotRect.x + slotPadding + 1, slotRect.y + slotPadding + 1, slotRect.width - 2 * slotPadding - 2, slotRect.height - 2 * slotPadding - 2);
    info.rdcRef.current?.render(slot, (color, ctx) => ctx.fillRect(slotRect.x, slotRect.y, slotRect.width, slotRect.height))
  } else
  {
    ctx.fillRect(slotRect.x + slotPadding, slotRect.y + slotPadding, slotRect.width - 2 * slotPadding, slotRect.height - 2 * slotPadding);
    ctx.strokeStyle = _getSlotColor();
    ctx.beginPath();
    ctx.moveTo(slotRect.x + slotRect.width, slotRect.y);
    ctx.lineTo(slotRect.x, slotRect.y + slotRect.height);
    ctx.stroke();
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

  const fromSlotRect = _calculateSlotRect(info, from, edge.from_slotID, true)
  const toSlotRect = _calculateSlotRect(info, to, edge.to_slotID, true)

  // Draw Edge
  ctx.strokeStyle = "#a0a0a0"
  ctx.setLineDash([5])
  ctx.beginPath();
  ctx.moveTo(fromSlotRect.x + (fromSlotRect.width / 2), fromSlotRect.y + (fromSlotRect.height / 2))
  ctx.lineTo(toSlotRect.x + (toSlotRect.width / 2), toSlotRect.y + (toSlotRect.height / 2));
  ctx.stroke();

  // Draw Slot Colors
  ctx.fillStyle = _getSlotColor(_.nth(from.slots.data, edge.from_slotID));
  ctx.fillRect(fromSlotRect.x, fromSlotRect.y, fromSlotRect.width, fromSlotRect.height);
  ctx.fillStyle = _getSlotColor(_.nth(to.slots.data, edge.to_slotID));
  ctx.fillRect(toSlotRect.x, toSlotRect.y, toSlotRect.width, toSlotRect.height);
}

/**
 * Returns the rectangle for a given slot id for an edge
 *
 * @param info common render information
 * @param node node to get the slot for
 * @param slotID id of the slot
 * @param draggable if the current drag should be included in calculation
 */
function _calculateSlotRect(info: IRenderInfo, node: Node, slotID: number, draggable: boolean): { x: number, y: number, width: number, height: number }
{
  const object = _.nth(node.slots.data, slotID);
  const iconSize = 50;
  const iconPadding = 5; // vertical padding between icon and slots
  const slotSize = 12; // size of a single edge slot rectangle
  const padding = 3; // padding between slots
  const amount: Point = node.slots; // number of slots in x and y direction
  const isSlotDragActive = draggable && !!object && info.dragging?.object === object; // true, if this slot is currently beeing dragged

  // x and y grid position for the current slot
  const gridPos: Point = {
    x: slotID % amount.x,
    y: Math.floor(slotID / amount.x)
  };

  // Position of the given node
  const nodePos: Point = {
    x: node.x + (info.dragging?.object === node ? info.dragging.change.x : 0),
    y: node.y + (info.dragging?.object === node ? info.dragging.change.y : 0),
  }

  // Size and position of the container that contains all slots for the rendered node
  const container = {
    x: nodePos.x - ((amount.x * slotSize + (amount.x - 1) * padding) / 2),
    y: nodePos.y + iconPadding + (iconSize / 2),
    width: amount.x * slotSize + (amount.x - 1) * padding,
    height: amount.x * slotSize + (amount.y - 1) * padding
  }

  // Position of the slot
  const slotPos: Point = {
    x: container.x + (gridPos.x * slotSize) + (gridPos.x * padding),
    y: container.y + (gridPos.y * slotSize) + (gridPos.y * padding),
  }

  // check if the current slot is about to be dragged
  if (isSlotDragActive)
  {
    slotPos.x += info.dragging!.change.x;
    slotPos.y += info.dragging!.change.y;
  }

  return {
    x: slotPos.x,
    y: slotPos.y,
    width: slotSize,
    height: slotSize
  }
}

/**
 * Returns the color that a slot has
 */
function _getSlotColor(slot?: Slot)
{
  switch (slot?.state)
  {
    case SlotState.UP:
      return "#4bbf04";
    case SlotState.DOWN:
      return "#dd0404";
    case SlotState.EMPTY:
      return "#a0a0a0";
    default:
      return "#dd0404";
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
