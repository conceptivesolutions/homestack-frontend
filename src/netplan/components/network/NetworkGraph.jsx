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
    x: pDevice.location === undefined ? 0 : pDevice.location.x,
    y: pDevice.location === undefined ? 0 : pDevice.location.y,
    shape: 'custom',
    ctxRenderer: _renderNode({
      title: pDevice.address,
      description: "id: " + pDevice.id
    }, pColor, 50),
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
 * @param onDragStart Function that gets called, if a drag was started
 * @param onDragEnd Function that gets called, if a drag was ended
 * @param onSelectionChanged Function that gets called, if the selection changed
 */
export const NetworkGraph = ({nodes, edges, onMove, onDoubleClick, onDragStart, onDragEnd, onSelectionChanged}) =>
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
      multiselect: true,
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
    network.current.on("dragStart", function (ctx)
    {
      if (ctx.nodes !== undefined && ctx.nodes.length > 0 && !!onDragStart)
        onDragStart();
    });

    // noinspection JSUnresolvedFunction
    network.current.on("dragEnd", function (ctx)
    {
      if (ctx.nodes !== undefined && ctx.nodes.length > 0)
      {
        // noinspection JSUnresolvedFunction
        onMove(network.current.getPositions(ctx.nodes));
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

    // noinspection JSUnresolvedFunction
    network.current.on("selectNode", function (ctx)
    {
      if (ctx.nodes !== undefined && !!onSelectionChanged)
        onSelectionChanged(ctx.nodes)
    })

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
  }, [domNode, network, data, options, grid, onMove, onDoubleClick, onDragStart, onDragEnd, onSelectionChanged]);

  return (
    <div className="network-graph" ref={domNode}/>
  );
}

/**
 * Renders a single node on the given context
 *
 * @param title Title for this node
 * @param description Description for this node
 * @param pColor Color for the icon
 * @param pSize Size for the icon
 * @private
 */
function _renderNode({title, description}, pColor, pSize)
{
  return ({ctx, x, y, state: {selected}}) =>
  {
    // do some math here
    // noinspection JSUnusedGlobalSymbols
    return {
      // bellow arrows
      // primarily meant for nodes and the labels inside of their boundaries
      drawNode()
      {
        // Font
        ctx.font = (pSize * 0.7) + 'px "Font Awesome 5 Free"';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        // Shadow
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Draw Icon
        ctx.fillStyle = pColor
        ctx.fillText("\uf6ff", x, y);

        // Draw Checkbox Icon
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.textBaseline = "top";
        ctx.textAlign = "right";
        ctx.fillStyle = (selected ? "#007bff" : "#dedede");
        ctx.font = '12pt "Font Awesome 5 Free"';
        ctx.fillText(selected ? "\uf14a" : "\uf0c8", x + (pSize / 2), y - (pSize / 2))
      },
      // above arrows
      // primarily meant for labels outside of the node
      drawExternalLabel()
      {
        ctx.textBaseline = "top"
        ctx.textAlign = "left"
        ctx.font = "10pt monospace"

        // Draw Title
        const {width} = ctx.measureText(title);
        ctx.fillText(title, x - (width / 2), y + (pSize / 2))

        // Draw Description
        if (description)
        {
          ctx.font = "8pt monospace"
          ctx.fillText(description, x - (width / 2), y + (pSize / 2) + 14)
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
