import * as d3 from "d3";
import { BaseType, Selection } from "d3";
import _ from "lodash";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { iconToSVG } from "../../helpers/iconHelper";
import { IDevice } from "../../models/definitions/backend/device";
import styles from "./GraphComponent.module.scss";

const PAGESIZE = 20_000;
const SLOTPADDING = 5;
const SLOTSIZE = 12;

type Node = IDevice & {
  color: string,
  title: string,
  drag?: {
    x: number,
    y: number
  }
}

type RenderInfo = {
  nodes: { [name: string]: Node },
  zoom: number,
  onSelect: (node: Node | null) => void,
  update: (value: (info: RenderInfo) => RenderInfo) => void,
}

type GraphComponentProps = {
  nodes: Node[],
  onSelect: (id: string | null) => void,
};

export const GraphComponent: React.VFC<GraphComponentProps> = ({ nodes, onSelect }) =>
{
  const containerRef = useRef<SVGSVGElement>(null);
  const memoizedNodes = useMemo(() => _.keyBy(nodes, node => node.id), [nodes]);
  const [renderInfo, setRenderInfo] = useState<RenderInfo>({
    nodes: {},
    zoom: 1,
    onSelect: pNode => onSelect(pNode?.id || null),
    update: () => null,
  });

  // update renderinfo, if something changed
  useEffect(() => setRenderInfo(pLastRender => ({
    ...pLastRender,
    nodes: _.mapValues(memoizedNodes, pNode => ({
      ...pLastRender?.nodes[pNode.id],
      ...pNode,
    })),
    update: setRenderInfo,
  })), [memoizedNodes, onSelect, setRenderInfo]);

  // render items
  useEffect(() => _createGraph(containerRef.current!, renderInfo), [renderInfo]);

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
function _createGraph(root: SVGSVGElement, info: RenderInfo)
{
  const content = d3.select(root).select("#contentLayer");
  const panPinch = d3.select(root).select("#panPinch");
  const drag = d3.select(root).selectAll(".node_icon_container");

  // init gesture handling
  _initGestures(root, panPinch, content, drag, info.update);

  // delete selection, because we clicked in the background
  panPinch.on("click", () => info.onSelect(null));

  // create nodes, if necessary
  const node = content.select("#nodes")
    .selectAll(".node")
    .data(_.values(info.nodes))
    .join(_createNodeSkeleton)

    // select node on click
    .on("click", (event, data) => info.onSelect(data));

  // update nodes with data
  _updateNodeData(node);
}

/**
 * Initializes all gestures
 *
 * @param root root element
 * @param panPinchSelection selection to execute the pan/pinch behavior
 * @param scaleSelection selection that should be updated with the pan/pinched transform
 * @param dragSelection selection that matches the elements that should be dragged
 * @param setRenderInfo method to update the render info
 */
function _initGestures(root: SVGSVGElement, panPinchSelection: Selection<any, any, any, any>, scaleSelection: Selection<any, any, any, any>,
                       dragSelection: Selection<any, any, any, any>, setRenderInfo: (value: (info: RenderInfo) => RenderInfo) => void)
{
  // pan/pinch zoom todo does not work if hovering over node
  panPinchSelection.call(d3.zoom()
    .scaleExtent([.25, 2])
    .translateExtent([[-(PAGESIZE / 2), -(PAGESIZE / 2)], [PAGESIZE / 2, PAGESIZE / 2]])
    .on("zoom", (e) =>
    {
      setRenderInfo(pInfo => ({
        ...pInfo,
        zoom: e.transform.k,
      }));
      scaleSelection.attr("transform", e.transform);
    }));

  // dragging
  dragSelection.call(d3.drag()
    .container(root)
    .on("drag", e => setRenderInfo(pInfo =>
    {
      const id = e.subject.id;
      const node: Node = pInfo.nodes[id];
      node.drag = {
        x: (node.drag?.x || node.location?.x || 0) + (e.dx / pInfo.zoom),
        y: (node.drag?.y || node.location?.y || 0) + (e.dy / pInfo.zoom),
      };
      pInfo.nodes[id] = node;

      return ({
        ...pInfo,
        nodes: pInfo.nodes,
      });
    }))
    .on("end", e => setRenderInfo(pInfo => //todo update node
    {
      const id = e.subject.id;
      const node: Node = pInfo.nodes[id];
      delete node.drag;
      pInfo.nodes[id] = node;
      return ({
        ...pInfo,
        nodes: pInfo.nodes,
      });
    })));
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

  // node icon container
  const iconContainer = node.append("g")
    .classed("node_icon_container", true)
    .attr("transform", "translate(-20, -20) scale(2, 2)");

  // node drag layer
  iconContainer.append("rect")
    .attr("width", "24")
    .attr("height", "24")
    .attr("fill", "transparent");

  // node icon
  iconContainer
    .append("path")
    .classed("node_icon", true);

  // node text
  node.append("text")
    .classed("node_title", true);

  // node slots // todo does this work, or should it be located inside updateNodeData?
  node.append("g")
    .classed("node_slots", true)
    .selectAll(".node_slots_row")
    .data(d => d.slots || [])
    .join(enter => enter
      .append("g")
      .classed("node_slots_row", true))

    // row -> cell
    .selectAll(".node_slots_cell")
    .data(d => d)
    .join(enter => enter
      .append("rect")
      .classed("node_slots_cell", true));

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
    .attr("transform", node => "translate(" + (node.drag?.x || node.location?.x || 0) + " " + (node.drag?.y || node.location?.y || 0) + ")");

  // icon
  node.select(".node_icon")
    .attr("d", d => d.icon ? iconToSVG(d.icon!) as string : "")
    .attr("fill", d => d.color);

  // slot rows
  node.selectAll(".node_slots_row")
    .attr("transform", (data, i) => "translate(0, " + (30 + ((SLOTSIZE + SLOTPADDING) * i)) + ")");

  // slot cells
  node.selectAll(".node_slots_row")
    .selectAll(".node_slots_cell")
    .attr("data", (data, i) => i)
    .attr("x", (data, i) => (SLOTSIZE + SLOTPADDING) * i)
    .attr("width", SLOTSIZE)
    .attr("height", SLOTSIZE)
    .attr("fill", "red");

  // title
  node.select(".node_title")
    .attr("y", d => ((d.slots?.length || 0) + 1) * (SLOTSIZE + SLOTPADDING) + 17)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "baseline")
    .text(d => d.title);
}
