import React from 'react'
import Graph from 'vis-react';
import './LayoutComponent.css'

/**
 * Component that will render the netplan chart as a network diagram
 */
export class LayoutComponent extends React.Component
{
  render()
  {
    var graph = {
        nodes: [
            {
              id: 1,
              label: 'Node 1',
              x: 100,
              y: 150
            },
            {
              id: 2,
              label: 'Node 2',
              x: 100,
              y: 100
            }
        ],
        edges: [
            { from: 1, to: 2 }
        ]
    };

    var options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: '#000000'
        },
        physics: {
            enabled: false
        },
        interaction: { hoverEdges: true }
    };

    var events = {
        dragEnd: function(event) {
          console.log(this.vis)
        }
    };

    return <div className="layoutGraph">
      <Graph
        graph={graph}
        options={options}
        events={events}
        vis={vis => (this.vis = vis)}
      />
    </div>;
  }
}
