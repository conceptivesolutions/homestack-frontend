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
  // A reference to the div rendered by this component
  const domNode = useRef(null);

  // A reference to the vis network instance
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
  }, [domNode, network, data, options, onMove]);

  return (
    <div className="layoutGraph" ref={domNode}/>
  );
}
