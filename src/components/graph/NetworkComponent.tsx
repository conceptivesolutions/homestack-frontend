import classNames from "classnames";
import {Node} from "components/graph/NetworkComponentModel";
import {RegionDetectionContainer} from "components/graph/regionDetection/RegionDetectionContainer";
import {IRenderInfo} from "components/graph/renderer/IRenderInfo";
import {Actions} from "components/graph/renderer/RenderConstants";
import {render} from "components/graph/renderer/Renderer";
import ZoomComponent, {IZoomComponentHandle} from "components/graph/statusbar/ZoomComponent";
import {preventDefault} from "helpers/Utility";
import _ from "lodash";
import React, {useEffect, useMemo, useRef} from 'react';
import useResizeAware from 'react-resize-aware';
import styles from "./NetworkComponent.module.scss";

interface INetworkComponent
{
  className?: string,
  data?: {
    nodes?: any[],
  },
  selection?: {
    node?: any,
  },
  nodeToNodeConverter: (node: any) => Node | undefined,
  onDrop?: (source: any, target: any) => void,
  onMove?: (source: any, x: number, y: number) => boolean,
  onDelete?: (source: any) => void,
  onSelectionChanged?: (object?: any) => void,
}

const NetworkComponent = (props: INetworkComponent) =>
{
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const regionDetectionContainer = useRef(new RegionDetectionContainer())
  const zoomHandle = useRef<IZoomComponentHandle>();
  const [canvasResizeListener, canvasSize] = useResizeAware();

  // we have to use refs here, because of "useMemo()" will create a canvas
  // once - and does not recreate it, if something changed!
  const info = useRef<IRenderInfo>({
    canvasRef,
    rdcRef: regionDetectionContainer,
    viewport: {x: 0, y: 0},
    data: {},
    zoom: 1,
    debug: {
      enabled: process.env.NODE_ENV === "development",
    }
  });

  // update events if properties change
  useEffect(() =>
  {
    info.current.events = {
      onDrop: props.onDrop,
      onMove: props.onMove,
      onDelete: props.onDelete,
      onSelectionChanged: props.onSelectionChanged,
    }
  }, [props.onDrop, props.onMove, props.onDelete, props.onSelectionChanged])

  // transform data, if data changes
  useEffect(() =>
  {
    info.current.data = ({
      nodes: _.keyBy(props.data?.nodes?.map(props.nodeToNodeConverter).filter(pV => !!pV).map(pV => pV!), "id"),
    });
    info.current.selection = {
      object: _.head([props.selection?.node].filter(pV => !!pV).map(props.nodeToNodeConverter)) || info.current.selection?.object,
    };
    regionDetectionContainer.current.clear(); //todo not whole clear, only remove or re-set
  }, [props.data, props.nodeToNodeConverter, props.selection?.node])

  // render if something changes
  useEffect(() => _requestRender(info.current), [canvasSize.width, canvasSize.height, props.data])

  // initialize keyboard detection
  useEffect(() =>
  {
    const listener = (e: KeyboardEvent) => _onKey(info.current, e.key);
    window.addEventListener("keyup", listener)
    return () => window.removeEventListener("keyup", listener);
  }, [])

  // initialize gesture detection
  useEffect(() =>
  {
    const Hammer = require("hammerjs");
    const hammer = new Hammer(canvasRef.current!);
    hammer.add(new Hammer.Pan({threshold: 1, direction: Hammer.DIRECTION_ALL}))
    hammer.add(new Hammer.Tap())
    hammer.add(new Hammer.Pinch());
    hammer.on("tap", (e: HammerInput) => _onCanvasClick(info.current, e.center.x, e.center.y))
    hammer.on("pinchstart panstart", (e: HammerInput) => _onCanvasDragStarted(info.current, e.center.x, e.center.y))
    hammer.on("pinchmove panmove", (e: HammerInput) => _onCanvasDragMoved(info.current, e.deltaX, e.deltaY))
    hammer.on("pinchmove", (e: HammerInput) => _onZoomChangeRequested(info.current, zoomHandle.current!, info.current.dragging!.initialZoom + (e.scale - 1)))
    hammer.on("pinchend panend", (e: HammerInput) => _onCanvasDragEnded(info.current, false, e.center.x, e.center.y))
    hammer.on("pinchcancel pancancel", (e: HammerInput) => _onCanvasDragEnded(info.current, true, e.center.x, e.center.y))
    return () => hammer.destroy();
  }, []);

  // We use a memo, because we do only want to redraw the canvas - not to fully recreate it
  const canvas = useMemo(() => <canvas className={classNames(styles.canvas, props.className)} ref={canvasRef}
                                       onWheel={preventDefault((e) => _onZoomChangeRequested(info.current, zoomHandle.current!, e.deltaY < 0))}/>, []);

  // Status Bar
  const statusBar = (
    <div className={styles.statusBar}>
      <div className={styles.alignSeparator}/>
      <ZoomComponent handle={pH => zoomHandle.current = pH} onZoomChange={pV => _onZoomChangeRequested(info.current, zoomHandle.current!, pV)}/>
    </div>
  );

  return <>
    {canvasResizeListener}
    {canvas}
    {statusBar}
  </>
};

/**
 * This function gets called, if the canvas was clicked
 */
function _onCanvasClick(info: IRenderInfo, clientX: number, clientY: number)
{
  const clickedObject = _getClickedObject(info, clientX, clientY);

  if (clickedObject === Actions.DELETE_SELECTION) // specialhandling: delete seletion
    _onKey(info, "Delete");
  else if (clickedObject !== info.selection?.object)
  {
    info.selection = {object: clickedObject};
    if (!!info.events?.onSelectionChanged)
      info.events.onSelectionChanged(clickedObject);
  }

  _requestRender(info);
}

/**
 * this function gets called, if the user started to drag over the canvas
 */
function _onCanvasDragStarted(info: IRenderInfo, clientX: number, clientY: number)
{
  // Search the region detection layer, if an object was clicked
  const clickedObject = _getClickedObject(info, clientX, clientY);

  // update dragging information in render
  info.dragging = {
    inProgress: false, // will be set in moved, if threshold exceeded
    initialZoom: info.zoom,
    object: clickedObject, // If the clickedObject is undefined, then no object was clicked - and the viewport should be dragged.
    origin: !clickedObject ? info.viewport : {x: clickedObject.x, y: clickedObject.y},
    change: {x: 0, y: 0},
    initialPointerLocation: _translateToCanvasCoordinates(info, clientX, clientY),
  };

  // handling: connection creation
  if (info.data.nodes && clickedObject?.kind === "slot")
  {
    const node = _.head(_.filter(info.data.nodes, pNode => !!_.head(pNode.slots.flatMap(pRow => pRow).filter(pSlot => pSlot === clickedObject))));
    if (!!node)
      info.dragging.creation = {
        connection: {
          node,
          slot: clickedObject,
        },
      }
  }
}

/**
 * this function gets called, if the user is dragging something
 */
function _onCanvasDragMoved(info: IRenderInfo, changeX: number, changeY: number)
{
  const dragging = info.dragging!;
  dragging.change = {
    x: changeX / info.zoom,
    y: changeY / info.zoom,
  }

  // viewport changed, if no object was dragged
  if (!dragging.object)
    info.viewport = {
      x: dragging.origin.x + dragging.change.x,
      y: dragging.origin.y + dragging.change.y,
    };

  dragging.inProgress = dragging.inProgress || (changeX + changeY !== 0);
  _requestRender(info)
}

/**
 * this function gets called, if the user dragged something (sucessfully)
 */
function _onCanvasDragEnded(info: IRenderInfo, cancelled: boolean, clientX?: number, clientY?: number)
{
  // Fire onDrop
  if (!cancelled && !!clientX && !!clientY && !!info.dragging?.object)
  {
    // Object was dropped
    if (!!info.events?.onDrop)
    {
      const target = _getClickedObject(info, clientX, clientY);
      if (!!target)
        info.events.onDrop(info.dragging.object, target);
    }

    // Move Object
    if (!!info.events?.onMove)
    {
      const targetPoint = {x: info.dragging.origin.x + info.dragging.change.x, y: info.dragging.origin.y + info.dragging.change.y};
      const moveInstantly = info.events.onMove(info.dragging.object, targetPoint.x, targetPoint.y)
      if (moveInstantly)
      {
        if (info.dragging.object.hasOwnProperty("x"))
          info.dragging.object.x = targetPoint.x;
        if (info.dragging.object.hasOwnProperty("y"))
          info.dragging.object.y = targetPoint.y;
      }
    }
  }
  info.dragging = undefined;
  _requestRender(info);
}

/**
 * gets called if the user pressed any key
 */
function _onKey(info: IRenderInfo, key: string)
{
  if (key === "Delete")
    if (!!info.selection?.object && !!info.events?.onDelete)
      info.events.onDelete(info.selection.object);
}

/**
 * this function gets called if the user requested a zoom change
 */
function _onZoomChangeRequested(info: IRenderInfo, statusBarComponentHandle: IZoomComponentHandle, value: boolean | number)
{
  const min = 0.25;
  const max = 2;
  if (typeof value === "boolean")
  {
    if (value && info.zoom < max)
      info.zoom += 0.03;
    else if (!value && info.zoom > min)
      info.zoom -= 0.03;
  } else
    info.zoom = value;

  info.zoom = Math.max(min, Math.min(max, info.zoom));
  statusBarComponentHandle.setValue(info.zoom);
  _requestRender(info);
}

/**
 * returns the underlying object that was potentially clicked
 */
function _getClickedObject(info: IRenderInfo, clientX: number, clientY: number)
{
  // Search the region detection layer, if an object was clicked
  const translated = _translateToCanvasCoordinates(info, clientX, clientY);
  const x = translated.x;
  const y = translated.y;
  info.debug = !!info.debug ? info.debug : {}; // create, if not exist
  info.debug.clickPoint = {x, y}
  return info.rdcRef.current.getObjectAt(x, y);
}

/**
 * Translates the given coordinates to canvas coordinates (top left is zero)
 */
function _translateToCanvasCoordinates(info: IRenderInfo, clientX: number, clientY: number)
{
  const canvasRect = info.canvasRef.current!.getBoundingClientRect();
  const x = clientX - canvasRect.x - info.viewport.x + info.viewport.x - 1;
  const y = clientY - canvasRect.y - info.viewport.y + info.viewport.y - 2;
  return {x, y}
}

/**
 * Queues a new frame for rendering
 */
function _requestRender(info: IRenderInfo)
{
  requestAnimationFrame(() => render(info))
}

export default NetworkComponent;
