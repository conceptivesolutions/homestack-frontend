import React, {useEffect, useRef} from 'react';
import {DataSet, Network} from "vis-network/standalone/esm/vis-network";

/**
 * Simple Node that contains the graph by vis.js
 *
 * @param nodes All nodes
 * @param edges All edges
 * @param onMove Function that consumes the ID and location of the moved node
 */
export const NetworkGraph = ({nodes, edges, onMove}) =>
{
  const domNode = useRef(null);
  const network = useRef(null);

  const data = {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges)
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
  }, [domNode, network, data, options, grid, onMove]);

  return (
    <div className="layoutGraph" ref={domNode}/>
  );
}
