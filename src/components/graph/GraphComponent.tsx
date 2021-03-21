import * as d3 from "d3";
import { BaseType, Selection } from "d3";
import React, { useEffect, useRef } from 'react';
import { iconToSVG } from "../../helpers/iconHelper";
import { IDevice } from "../../models/definitions/backend/device";
import styles from "./GraphComponent.module.scss";

const PAGESIZE = 20_000;

type Node = IDevice & {
  color: string,
  title: string,
}

type GraphComponentProps = {
  nodes: Node[],
  onSelect: (id: string | null) => void,
};

export const GraphComponent: React.VFC<GraphComponentProps> = ({ nodes, onSelect }) =>
{
  const containerRef = useRef<SVGSVGElement>(null);

  // render items
  useEffect(() => _createGraph(containerRef.current!, nodes, (pDev) => onSelect(pDev?.id || null)), [nodes, onSelect]);

  // fixed layer
  const fixedLayer = <g id={"fixedLayer"}>
    <rect id={"panPinch"} fill={"transparent"} width={"100%"} height={"100%"}/>
  </g>;

  // moving layer (with zoom and pan)
  const contentLayer = <g id={"contentLayer"}>
    {/* Definitions */}
    <defs>
      <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
      </pattern>
      <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#smallGrid)"/>
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
      </pattern>
    </defs>

    {/* Background */}
    <rect id={"background"} style={{ pointerEvents: "none" }} x={-(PAGESIZE / 2)} y={-(PAGESIZE / 2)} width={PAGESIZE} height={PAGESIZE} fill="url(#grid)"/>

    {/* nodes */}
    <g id={"nodes"}/>
  </g>;

  return (<div className={styles.container}>
    <svg className={styles.svg} ref={containerRef}>
      {fixedLayer}
      {contentLayer}
    </svg>
  </div>);
};

/**
 * Creates the Graph
 */
function _createGraph(root: SVGSVGElement, nodes: Node[], onSelect: (node: Node | null) => void)
{
  const content = d3.select(root).select("#contentLayer");
  const panPinch = d3.select(root).select("#panPinch");

  // init gesture handling
  _initGestures(panPinch, content);

  // delete selection, because we clicked in the background
  panPinch.on("click", () => onSelect(null));

  // create nodes, if necessary
  const node = content.select("#nodes")
    .selectAll(".node")
    .data(nodes)
    .join(_createNodeSkeleton)

    // select node on click
    .on("click", (event, data) => onSelect(data));

  // update nodes with data
  _updateNodeData(node);
}

/**
 * Initializes all gestures
 *
 * @param panPinchSelection selection to execute the pan/pinch behavior
 * @param scaleSelection selection that should be updated with the pan/pinched transform
 */
function _initGestures(panPinchSelection: Selection<any, any, any, any>, scaleSelection: Selection<any, any, any, any>)
{
  // pan/pinch zoom
  panPinchSelection.call(d3.zoom()
    .scaleExtent([.25, 2])
    .translateExtent([[-(PAGESIZE / 2), -(PAGESIZE / 2)], [PAGESIZE / 2, PAGESIZE / 2]])
    .on("zoom", (e) => scaleSelection.attr("transform", e.transform)));
}

/**
 * Creates the "frame" / "skeleton" of the node svg element.
 * This is all about fixed structure, not about dynamic data.
 *
 * @param container outter container to add to
 */
function _createNodeSkeleton(container: Selection<any, Node, BaseType, any>)
{
  const node = container
    .append("g")
    .classed("node", true);

  // node icon
  node.append("g")
    .attr("transform", "translate(-20, -20) scale(2, 2)")
    .append("path")
    .classed("node_icon", true);

  // node text
  node.append("text")
    .classed("node_title", true);

  return node;
}

/**
 * Update the data in the previously created node skeleton
 *
 * @param node Node container to update
 */
function _updateNodeData(node: Selection<any, Node, BaseType, any>)
{
  // position
  node
    .attr("transform", node => "translate(" + (node.location?.x || 0) + " " + (node.location?.y || 0) + ")");

  // icon
  node.select(".node_icon")
    .attr("d", d => d.icon ? iconToSVG(d.icon!) as string : "")
    .attr("fill", d => d.color);

  // title
  node.select(".node_title")
    .attr("y", 36)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .text(d => d.title);
}
