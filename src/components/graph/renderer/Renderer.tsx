import {mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiTrashCanOutline} from "@mdi/js";
import {Node, Point, Rectangle, Slot, SlotState} from "components/graph/NetworkComponentModel";
import {IRenderInfo} from "components/graph/renderer/IRenderInfo";
import {Actions, ConnectionConstants, NodeConstants, SlotConstants} from "components/graph/renderer/RenderConstants";
import {iconToPath2D} from "helpers/iconHelper";
import _ from "lodash";

/**
 * Renders the information in the renderInfo object to the canvas given in the object
 *
 * @param info information object with all in it
 */
export function render(info: IRenderInfo)
{
  const beginDate = Date.now();
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

  // render all "in progress" information
  _renderCreationInProgress(ctx, info);

  // render debug stuff, if we should do it
  if (!!info.debug?.enabled)
    _renderDebug(ctx, info);

  // update renderinfo for next render instance
  info.frameRenderInfo = {
    renderTime: Date.now() - beginDate,
    frameSize: {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    },
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
  const nodeX = node.x + (info.dragging?.object === node ? info.dragging.change.x : 0);
  const nodeY = node.y + (info.dragging?.object === node ? info.dragging.change.y : 0);

  // Draw Network Slot Backgrounds
  for (let slotX = 0; slotX < node.slots.length; slotX++)
    for (let slotY = 0; slotY < node.slots[slotX].length; slotY++)
      _renderSlot(ctx, info, node, node.slots[slotX][slotY], slotX, slotY)

  // Draw Icon
  if (!!node.icon)
    _renderNodeIcon(ctx, info, node, nodeX, nodeY);

  // Draw Selection State
  _renderNodeSelectionState(ctx, info, node, nodeX, nodeY);

  // Draw Title
  if (!!node.title)
    _renderNodeText(ctx, info, node, nodeX, nodeY);
}

/**
 * Renders the icon of a single node
 *
 * @param ctx context to render on
 * @param info render info
 * @param node node to render
 * @param nodeX x coordinate of the node
 * @param nodeY y coordinate of the node
 */
function _renderNodeIcon(ctx: CanvasRenderingContext2D, info: IRenderInfo, node: Node, nodeX: number, nodeY: number)
{
  const old = ctx.getTransform();
  ctx.shadowColor = "black";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.transform(2, 0, 0, 2, nodeX - (NodeConstants.ICON_SIZE / 2), nodeY - (NodeConstants.ICON_SIZE / 2))
  ctx.fillStyle = node.color || "black";
  ctx.fill(iconToPath2D(node.icon!)!)
  ctx.setTransform(old);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Draw clickable region
  info.rdcRef.current?.render(node, (color, ctx) => ctx.fillRect(nodeX - (NodeConstants.ICON_SIZE / 2), nodeY - (NodeConstants.ICON_SIZE / 2),
    NodeConstants.ICON_SIZE, NodeConstants.ICON_SIZE));
}

/**
 * Renders the state of the selection of a single node
 *
 * @param ctx context to render on
 * @param info render info
 * @param node node to render
 * @param nodeX x coordinate of the node
 * @param nodeY y coordinate of the node
 */
function _renderNodeSelectionState(ctx: CanvasRenderingContext2D, info: IRenderInfo, node: Node, nodeX: number, nodeY: number)
{
  const old = ctx.getTransform();
  const isSelected = node.id === info.selection?.object?.id || _.isEqual(node, info.selection?.object);
  const selectionSize = 0.7;
  ctx.transform(selectionSize, 0, 0, selectionSize, nodeX - (NodeConstants.ICON_SIZE / 2) - 7, nodeY - (NodeConstants.ICON_SIZE / 2) - 7);
  ctx.fillStyle = isSelected ? "#14bae4" : "#d7d7d7";
  ctx.fill(new Path2D(isSelected ? mdiCheckboxMarked : mdiCheckboxBlankOutline))
  ctx.setTransform(old);

  // Draw clickable region
  info.rdcRef.current?.render(node, (color, ctx) => ctx.fillRect(nodeX - (NodeConstants.ICON_SIZE / 2) - 7, nodeY - (NodeConstants.ICON_SIZE / 2) - 7, 17, 17))
}

/**
 * Renders the descriptive text a single node
 *
 * @param ctx context to render on
 * @param info render info
 * @param node node to render
 * @param nodeX x coordinate of the node
 * @param nodeY y coordinate of the node
 */
function _renderNodeText(ctx: CanvasRenderingContext2D, info: IRenderInfo, node: Node, nodeX: number, nodeY: number)
{
  ctx.fillStyle = "black";
  ctx.textBaseline = "top"
  ctx.textAlign = "center"
  ctx.font = "10pt monospace"

  const slotsHeight = node.slots.length * SlotConstants.SIZE + (node.slots.length - 1) * SlotConstants.PADDING;
  ctx.fillText(node.title!, nodeX, nodeY + (NodeConstants.ICON_SIZE / 2) + NodeConstants.PADDING + slotsHeight + NodeConstants.PADDING);
}

/**
 * Renders a single slot with the connection to the target slot, if available and necessary
 *
 * @param ctx context to render on
 * @param info render info
 * @param node source node
 * @param slot slot to render
 * @param slotRow x grid coordinate
 * @param slotColumn y grid coordinate
 */
function _renderSlot(ctx: CanvasRenderingContext2D, info: IRenderInfo, node: Node, slot: Slot, slotRow: number, slotColumn: number)
{
  const target = _.head(_.map(info.data.nodes, pNode => _.head(pNode.slots.flatMap(pRow => pRow)
    .filter(pSlot => slot.targetSlotID === pSlot.id)
    .map(pSlot => ({
      node: pNode,
      slot: pSlot,
    })))));

  // render slot state
  const fromSlotRect = _calculateSlotRect(info, node, slot, false)
  ctx.fillStyle = _getSlotColor(slot);
  ctx.strokeStyle = _getSlotColor(slot);
  if (slot.state !== undefined)
    ctx.fillRect(fromSlotRect.x, fromSlotRect.y, fromSlotRect.width, fromSlotRect.height);
  else
    ctx.strokeRect(fromSlotRect.x + SlotConstants.PADDING_BACKGROUND, fromSlotRect.y + SlotConstants.PADDING_BACKGROUND,
      fromSlotRect.width - (2 * +SlotConstants.PADDING_BACKGROUND), fromSlotRect.height - (2 * +SlotConstants.PADDING_BACKGROUND));

  // render slot dragable
  info.rdcRef.current.render(slot, (pColor, pCtx) => pCtx.fillRect(fromSlotRect.x, fromSlotRect.y, fromSlotRect.width, fromSlotRect.height))

  if (!target)
    return;

  // render connection
  _renderConnection(ctx, info, slot, target.slot, fromSlotRect, _calculateSlotRect(info, target.node, target.slot, false));
}

/**
 * Renders the connection between two slots
 *
 * @param ctx context to render on
 * @param info render info
 * @param source slot to start
 * @param target slot to end
 * @param sourceRect rect for source
 * @param targetRect rect for target
 */
function _renderConnection(ctx: CanvasRenderingContext2D, info: IRenderInfo, source: Slot, target: Slot, sourceRect: Rectangle, targetRect: Rectangle)
{
  const sourceSlotID = source.id;
  const targetSlotID = target.id;
  const sourceX = sourceRect.x + (sourceRect.width / 2);
  const sourceY = sourceRect.y + (sourceRect.height / 2);
  const targetX = targetRect.x + (targetRect.width / 2);
  const targetY = targetRect.y + (targetRect.height / 2);

  // Draw Connection
  ctx.strokeStyle = _getSlotColor(source, target);
  ctx.beginPath();
  ctx.moveTo(sourceX, sourceY)
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // render connection selectable
  info.rdcRef.current.render({
    kind: "connection",
    fromSlot: sourceSlotID,
    toSlot: targetSlotID
  }, (pColor, pCtx) =>
  {
    pCtx.lineWidth = 7;
    pCtx.beginPath();
    pCtx.moveTo(sourceX, sourceY)
    pCtx.lineTo(targetX, targetY);
    pCtx.stroke();
  })

  // currently selected connection
  if (info.selection?.object?.kind === "connection" && info.selection.object.fromSlot === sourceSlotID && info.selection.object.toSlot === targetSlotID)
  {
    const old = ctx.getTransform();
    const x = sourceX + ((targetX - sourceX) / 2) - (ConnectionConstants.DELETE_ICON_SIZE / 2);
    const y = sourceY + ((targetY - sourceY) / 2) - (ConnectionConstants.DELETE_ICON_SIZE / 2);
    ctx.transform(1, 0, 0, 1, x, y)
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, ConnectionConstants.DELETE_ICON_SIZE, ConnectionConstants.DELETE_ICON_SIZE)
    ctx.fillStyle = "red";
    ctx.fill(new Path2D(mdiTrashCanOutline))
    ctx.setTransform(old);

    info.rdcRef.current.render(Actions.DELETE_SELECTION, (pColor, pCtx) =>
    {
      pCtx.transform(1, 0, 0, 1, x, y)
      pCtx.fillRect(0, 0, ConnectionConstants.DELETE_ICON_SIZE, ConnectionConstants.DELETE_ICON_SIZE)
    });
  }

  // Draw "Plug"
  const plugSize = 3;
  ctx.fillStyle = "#00000080";
  ctx.fillRect(sourceX - plugSize, sourceY - plugSize, 2 * plugSize, 2 * plugSize);
  ctx.fillRect(targetX - plugSize, targetY - plugSize, 2 * plugSize, 2 * plugSize);
}

/**
 * Renders anything onto the context, that is going to be created
 *
 * @param ctx context to render on
 * @param info render info
 */
function _renderCreationInProgress(ctx: CanvasRenderingContext2D, info: IRenderInfo)
{
  // render newly created connection
  if (!!info.dragging?.creation?.connection)
  {
    const from = info.dragging.creation.connection;
    const fromSlotRect = _calculateSlotRect(info, from.node, from.slot, false);

    // Draw Line to Mouse
    ctx.strokeStyle = "#a0a0a0"
    ctx.setLineDash([5])
    ctx.beginPath();
    ctx.moveTo(fromSlotRect.x + (fromSlotRect.width / 2), fromSlotRect.y + (fromSlotRect.height / 2))

    const old = ctx.getTransform();
    ctx.resetTransform();
    ctx.lineTo(info.dragging.initialPointerLocation.x + info.dragging.change.x * info.zoom,
      info.dragging.initialPointerLocation.y + info.dragging.change.y * info.zoom);
    ctx.setTransform(old)

    ctx.stroke();
  }
}

/**
 * Returns the rectangle for a given slot id for a network slot
 *
 * @param info common render information
 * @param node node to get the slot for
 * @param slot source slot
 * @param draggable if the current drag should be included in calculation
 */
function _calculateSlotRect(info: IRenderInfo, node: Node, slot: Slot, draggable: boolean): Rectangle
{
  const isSlotDragActive = draggable && !!slot && info.dragging?.object === slot; // true, if this slot is currently beeing dragged

  // max number of slots in x and y direction
  const maxAmount: Point = {
    x: _.maxBy(node.slots, pSlots => pSlots.length)?.length || 0,
    y: node.slots.length,
  };

  // x and y grid position for the current slot
  const gridPos: Point = {
    x: _.head(node.slots.map(pRow => pRow.indexOf(slot)).filter(pIdx => pIdx > -1))!,
    y: _.findIndex(node.slots, pRow => pRow.indexOf(slot) > -1)
  };

  // Position of the given node
  const nodePos: Point = {
    x: node.x + (info.dragging?.object === node ? info.dragging.change.x : 0),
    y: node.y + (info.dragging?.object === node ? info.dragging.change.y : 0),
  }

  // Size and position of the container that contains all slots for the rendered node
  const container = {
    x: nodePos.x - ((maxAmount.x * SlotConstants.SIZE + (maxAmount.x - 1) * SlotConstants.PADDING) / 2),
    y: nodePos.y + NodeConstants.PADDING + (NodeConstants.ICON_SIZE / 2),
    width: maxAmount.x * SlotConstants.SIZE + (maxAmount.x - 1) * SlotConstants.PADDING,
    height: maxAmount.x * SlotConstants.SIZE + (maxAmount.y - 1) * SlotConstants.PADDING
  }

  // Position of the slot
  const slotPos: Point = {
    x: container.x + (gridPos.x * SlotConstants.SIZE) + (gridPos.x * SlotConstants.PADDING),
    y: container.y + (gridPos.y * SlotConstants.SIZE) + (gridPos.y * SlotConstants.PADDING),
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
    width: SlotConstants.SIZE,
    height: SlotConstants.SIZE
  }
}

/**
 * Returns the color that a slot has
 */
function _getSlotColor(slot?: Slot, slot2?: Slot)
{
  if (slot?.state === SlotState.ONLINE && (!slot2 || slot2?.state === SlotState.ONLINE))
    return "#4bbf04";
  else if (slot?.state === SlotState.OFFLINE || slot2?.state === SlotState.OFFLINE)
    return "#dd0404";
  return "#a0a0a0";
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
  ctx.globalAlpha = 0.15;

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

  // render time
  if (!!info.frameRenderInfo?.renderTime)
  {
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "black";
    ctx.fillText(info.frameRenderInfo.renderTime + " ms", 5, 5)
  }

  // reset alpha
  ctx.globalAlpha = oldAlpha;
}
