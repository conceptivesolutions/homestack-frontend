import {getMetricRecordByType} from "helpers/deviceHelper";
import {iconToPath2D} from "helpers/iconHelper";
import React, {useEffect, useRef} from 'react';
import {EMetricTypes, IDevice, IEdge} from "types/model";
import {DataSetEdges, DataSetNodes, Edge, Network, Node, Position} from "vis-network";
import styles from "./NetworkGraph.module.scss"

/**
 * Converts a homestack device to the correct vis.js node
 */
export function deviceToNode(pDevice: IDevice, pColor: string): Node
{
  const hostName = getMetricRecordByType(pDevice, EMetricTypes.REVERSE_DNS)?.result?.name;
  const ping = getMetricRecordByType(pDevice, EMetricTypes.PING)?.result?.responseTime;

  return {
    id: pDevice.id.toString(),
    label: JSON.stringify({
      icon: pDevice.icon,
      title: hostName || pDevice.address,
      description: hostName && ("ip: " + pDevice.address + "\nping: " + ping + "ms")
    }),
    x: pDevice.location === undefined ? 0 : pDevice.location.x,
    y: pDevice.location === undefined ? 0 : pDevice.location.y,
    shape: 'custom',
    color: pColor,
    shadow: {
      color: "",
      enabled: true,
      x: 2,
      y: 2,
      size: 5,

      // @ts-ignore
      test: 5,
    },

    // @ts-ignore Enforce renderer
    ctxRenderer: _renderNode(50, iconToPath2D("mdiCheckbox"), iconToPath2D("mdiCheckboxMarked")),
  };
}

/**
 * Extracts vis.js edges from homestack edge
 */
export function edgeToEdge(pEdge: IEdge): Edge
{
  const {id, sourceID, targetID} = pEdge;
  return {
    id,
    from: sourceID,
    to: targetID,
    dashes: true,
    color: "#a0a0a0",
  }
}

interface INetworkGraph
{
  nodes: DataSetNodes,
  edges: DataSetEdges,
  onMove: (positions: { [nodeID: string]: Position }) => void,
  onDoubleClick: (nodeIDs: string[]) => void,
  onDragStart: () => void,
  onDragEnd: () => void,
  onZoomChange: (level: number) => void,
  onSelectionChanged: (nodes: string[], edges: string[]) => void,
  onNetworkChange?: (network?: Network) => void,
}

/**
 * Simple Node that contains the graph by vis.js
 *
 * @param nodes All nodes as DataSet
 * @param edges All edges as DataSet
 * @param onMove Function that consumes the ID and location of the moved node
 * @param onDoubleClick Function that consumes the ID of the double clicked node
 * @param onDragStart Function that gets called, if a drag was started
 * @param onDragEnd Function that gets called, if a drag was ended
 * @param onSelectionChanged Function that gets called, if the selection changed
 * @param onNetworkChange Function that gets called, if the network changed
 * @param onZoomChange Function that gets called, if the zoom level changed
 */
export const NetworkGraph = ({nodes, edges, onMove, onDoubleClick, onDragStart, onDragEnd, onSelectionChanged, onNetworkChange, onZoomChange}: INetworkGraph) =>
{
  const domNode = useRef<HTMLDivElement>(null);
  const network = useRef<Network | null>(null);

  const data = {
    nodes,
    edges
  };

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: '#000000',
      smooth: false,
      selectionWidth: 0,
    },
    physics: {
      enabled: false
    },
    interaction: {
      selectConnectedEdges: false,
      multiselect: true,
      zoomSpeed: 0.5,
    },
  };

  const grid = {
    spacing: 10,
    countBoldLines: 5,
    color: '#f0f0f0',
    boldColor: '#e2e2e2',
    coordinateSystemColor: undefined,
  }

  useEffect(() =>
  {
    // noinspection JSValidateTypes
    network.current = new Network(domNode.current!, data, options);

    // noinspection JSUnresolvedFunction
    network.current.on("dragStart", function (ctx)
    {
      if (ctx.nodes !== undefined && ctx.nodes.length > 0 && !!onDragStart)
        onDragStart();

      // Selection Workaround
      if (!!onSelectionChanged)
      {
        const {nodes, edges} = network.current?.getSelection() || {}
        onSelectionChanged(nodes as string[], edges as string[]);
      }
    });

    // noinspection JSUnresolvedFunction
    network.current.on("dragEnd", function (ctx)
    {
      if (ctx.nodes !== undefined && ctx.nodes.length > 0)
      {
        // noinspection JSUnresolvedFunction
        onMove(network.current!.getPositions(ctx.nodes));
        if (!!onDragEnd)
          onDragEnd();
      }
    });

    // noinspection JSUnresolvedFunction
    network.current.on("doubleClick", function (ctx)
    {
      if (ctx.nodes !== undefined && ctx.nodes.length > 0)
        onDoubleClick(ctx.nodes);
    });

    network.current!.on("selectNode", ({nodes, edges}) => !!onSelectionChanged && onSelectionChanged(nodes, edges));
    network.current!.on("deselectNode", ({nodes, edges}) => !!onSelectionChanged && onSelectionChanged(nodes, edges));
    network.current!.on("selectEdge", ({nodes, edges}) => !!onSelectionChanged && onSelectionChanged(nodes, edges));
    network.current!.on("deselectEdge", ({nodes, edges}) => !!onSelectionChanged && onSelectionChanged(nodes, edges));

    network.current!.on("zoom", () => !!onZoomChange && onZoomChange(network.current!.getScale()));
    network.current!.on("resize", () => !!onZoomChange && onZoomChange(network.current!.getScale()));
    network.current!.on("afterDrawing", () => !!onZoomChange && onZoomChange(network.current!.getScale()));

    // noinspection JSUnresolvedFunction
    network.current.on("beforeDrawing", function (ctx)
    {
      const size = grid.spacing; // space between the lines
      const boldLine = grid.countBoldLines; // number to declare, which n-th line should be "bold"
      const normalColor = grid.color;
      const boldColor = grid.boldColor;
      const coordinateSystemColor = grid.coordinateSystemColor;

      let scale = network.current!.getScale();
      let {x, y} = network.current!.getViewPosition();
      let width = ctx.canvas.width / scale;
      let height = ctx.canvas.height / scale;
      let gridSteps = 1;

      let minGridX = Math.floor((x - (width / 2)) / size);
      let minGridY = Math.floor((y - (height / 2)) / size);
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

      // draw x and y coordinate system lines
      if (!!coordinateSystemColor)
      {
        ctx.strokeStyle = coordinateSystemColor;
        ctx.beginPath();
        ctx.moveTo(minGridX * size, 0);
        ctx.lineTo((minGridX + gridCountX) * size, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, minGridY * size);
        ctx.lineTo(0, (minGridY + gridCountY) * size);
        ctx.stroke();
      }
    });

    // Fire network change
    if (!!onNetworkChange)
      onNetworkChange(network.current);
  }, [domNode, network, data, options, grid, onMove, onDoubleClick, onDragStart, onDragEnd, onSelectionChanged, onNetworkChange, onZoomChange]);

  return (
    <div className={styles.networkGraph} ref={domNode}/>
  );
}

/**
 * Renders a single node on the given context
 *
 * @param pSize Size for the icon
 * @param pSelectionPath Path for an unselected checkbox
 * @param pSelectionMarkedPath Path for an selected checkbox
 * @private
 */
function _renderNode(pSize: number, pSelectionPath?: Path2D, pSelectionMarkedPath?: Path2D)
{
  return ({ctx, x, y, state: {selected}, style: {color}, label}: { ctx: any, x: number, y: number, state: { selected: boolean }, style: any, label: string }) =>
  {
    // do some math here
    // noinspection JSUnusedGlobalSymbols
    return {
      // bellow arrows
      // primarily meant for nodes and the labels inside of their boundaries
      drawNode()
      {
        const {icon} = JSON.parse(label);

        // Font
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        // Shadow
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Draw Icon
        const oldTransform = ctx.getTransform();
        if (!!icon)
        {
          ctx.fillStyle = color
          ctx.transform(2, 0, 0, 2, x - (pSize / 2), y - (pSize / 2))
          ctx.fill(iconToPath2D(icon))
          ctx.setTransform(oldTransform)
        }

        // Draw Checkbox Icon
        if (!!pSelectionMarkedPath && !!pSelectionPath)
        {
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillStyle = (selected ? "#007bff" : "#dedede");
          ctx.transform(0.8, 0, 0, 0.8, x + (pSize / 2) - 10, y - (pSize / 2) - 10)
          ctx.fill(selected ? pSelectionMarkedPath : pSelectionPath)
          ctx.setTransform(oldTransform)
        }
      },
      // above arrows
      // primarily meant for labels outside of the node
      drawExternalLabel()
      {
        ctx.textBaseline = "top"
        ctx.textAlign = "left"
        ctx.font = "10pt monospace"

        // Draw Title
        const {title, description} = JSON.parse(label);
        const {width} = ctx.measureText(title);
        ctx.fillText(title, x - (width / 2), y + (pSize / 2))

        // Draw Description
        if (description)
        {
          ctx.font = "8pt monospace"
          _drawMultilineText(ctx, description, 12, x - (width / 2), y + (pSize / 2) + 14)
        }
      },
      // node dimensions defined by node drawing
      nodeDimensions: {
        width: pSize,
        height: pSize
      },
    }
  }
}

/**
 * Function to draw multiline text onto a context
 */
function _drawMultilineText(ctx: any, text: string, lineHeight: number, x: number, y: number)
{
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; ++i)
  {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
}
