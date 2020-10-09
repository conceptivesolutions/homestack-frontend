import React, {useEffect, useRef} from 'react';
import {Network} from "vis-network/standalone/esm/vis-network";
import "./NetworkGraph.scss"

/**
 * Converts a netplan device to the correct vis.js node
 */
export function deviceToNode(pDevice, pColor)
{
  return {
    id: pDevice.id,
    label: pDevice.address,
    x: pDevice.location === undefined ? 0 : pDevice.location.x,
    y: pDevice.location === undefined ? 0 : pDevice.location.y,
    shape: 'icon',
    icon: {
      face: '"Font Awesome 5 Free"',
      code: '\uf6ff',
      size: 30,
      color: pColor
    },
    shadow: {
      enabled: true,
      x: 2,
      y: 2,
      size: 5,
    },
  };
}

/**
 * Extracts vis.js edges from netplan devices
 */
export function deviceToEdge(pDevice)
{
  const {edges, id} = pDevice;
  if (edges === undefined)
    return [];

  return edges
    .map(({deviceID}) =>
    {
      return {
        from: id,
        to: deviceID,
        dashes: true,
        color: "#a0a0a0",
      }
    })
}

/**
 * Simple Node that contains the graph by vis.js
 *
 * @param nodes All nodes as DataSet
 * @param edges All edges as DataSet
 * @param onMove Function that consumes the ID and location of the moved node
 * @param onDoubleClick Function that consumes the ID of the double clicked node
 */
export const NetworkGraph = ({nodes, edges, onMove, onDoubleClick}) =>
{
  const domNode = useRef(null);
  const network = useRef(null);

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
    }
  };

  const grid = {
    spacing: 10,
    countBoldLines: 5,
    color: '#eeeeee',
    boldColor: '#d0d0d0'
  }

  useEffect(() =>
  {
    // noinspection JSValidateTypes
    network.current = new Network(domNode.current, data, options);

    // noinspection JSUnresolvedFunction
    network.current.on("dragEnd", function (ctx)
    {
      if (ctx.nodes !== undefined && ctx.nodes.length > 0)
        // noinspection JSUnresolvedFunction
        onMove(network.current.getPositions(ctx.nodes));
    });

    // noinspection JSUnresolvedFunction
    network.current.on("doubleClick", function (ctx)
    {
      if (ctx.nodes !== undefined && ctx.nodes.length > 0)
        onDoubleClick(ctx.nodes);
    });

    // noinspection JSUnresolvedFunction
    network.current.on("beforeDrawing", function (ctx)
    {
      const size = grid.spacing; // space between the lines
      const boldLine = grid.countBoldLines; // number to declare, which n-th line should be "bold"
      const normalColor = grid.color;
      const boldColor = grid.boldColor;

      let scale = network.current.getScale();
      let {x, y} = network.current.getViewPosition();
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
    });
  }, [domNode, network, data, options, grid, onMove, onDoubleClick]);

  return (
    <div className="network-graph" ref={domNode}/>
  );
}
