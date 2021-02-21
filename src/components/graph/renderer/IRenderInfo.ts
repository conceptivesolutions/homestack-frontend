import { Node, Point, Slot } from "components/graph/NetworkComponentModel";
import { RegionDetectionContainer } from "components/graph/regionDetection/RegionDetectionContainer";
import { Dictionary } from "lodash";
import { MutableRefObject } from "react";

export interface IRenderInfo
{
  /* reference to canvas where the render should happen */
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,

  /* reference to region detection container */
  rdcRef: MutableRefObject<RegionDetectionContainer>,

  /* all data to render */
  data: {

    /* nodes to display as dictionary, where key = ID */
    nodes?: Dictionary<Node>,

  }

  /* current viewport */
  viewport: Point,

  /* zoom level, 0.5 = 50%, 1.0 = 100%, 2.0 = 200%, ... */
  zoom: number,

  /* contains all information about the currently selected object(s) */
  selection?: {

    /* the selected object */
    object: any
  }

  /* contains all information about something that should be rendered in debug mode */
  debug?: {

    /* true if debug-mode is ON */
    enabled?: boolean,

    /* Point where the mouse clicked */
    clickPoint?: Point,
  }

  /* contains all information about the current drag */
  dragging?: {

    /* true if the drag exceeds the threshold of not "really being a drag event" */
    inProgress: boolean,

    /* the currently dragged object, UNDEFINED if the viewport was dragged */
    object?: any,

    /* the origin where the object initially was (before drag) */
    origin: Point,

    /* the amount of x/y that was dragged */
    change: Point,

    /* the scale amount when the drag / pinch started */
    initialZoom: number,

    /* initial pointer location, relative to the left upper canvas corner */
    initialPointerLocation: Point,

    /* this object will be filled, if there is a object creation ongoing */
    creation?: {

      /* will be filled, if an connection will be created by dragging */
      connection?: {
        node: Node,
        slot: Slot,
      }
    }
  },

  /* contains all information about event firing */
  events?: {

    /* listener that fires, if an object was dropped onto another one */
    onDrop?: (source: any, target: any) => void,

    /* listener that fires, if a node was moved to another location */
    onNodeMoved?: (source: Node, x: number, y: number) => boolean,

    /* listener that fires, if the user wanted to delete a node */
    onNodeDeleted?: (source: Node) => void,

    /* listener that fires, if the selection changed */
    onSelectionChanged?: (object: any) => void,
  }

  /* contains all volatile information of the last rendered frame */
  frameRenderInfo?: {

    /* rendered frame size */
    frameSize?: { width: number, height: number },

    /* time that the last frame consumed to render */
    renderTime?: number;
  }
}
