import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import { IDevice } from "../../models/definitions/backend/device";
import styles from "./GraphComponent.module.scss";

const PAGESIZE = 20_000;

type GraphComponentProps = {
  devices: IDevice[],
  onSelect: (id: string | null) => void,
};

export const GraphComponent: React.VFC<GraphComponentProps> = ({ devices: initialDevices, onSelect }) =>
{
  const containerRef = useRef<SVGSVGElement>(null);

  // render items
  useEffect(() => _createGraph(containerRef.current!, initialDevices, (pDev) => onSelect(pDev?.id || null)), [initialDevices, onSelect]);

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

    {/* Devices */}
    <g id={"devices"}/>
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
function _createGraph(root: SVGSVGElement, devices: IDevice[], onSelect: (id: IDevice | null) => void)
{
  const content = d3.select(root)
    .select("#contentLayer");

  // zoom
  d3.select(root)
    .select("#panPinch")

    // @ts-ignore
    .call(d3.zoom()
      .scaleExtent([.25, 2])
      .translateExtent([[-(PAGESIZE / 2), -(PAGESIZE / 2)], [PAGESIZE / 2, PAGESIZE / 2]])
      .on("zoom", (e) => content.attr("transform", e.transform)))

    // delete selection, because we clicked in the background
    .on("click", () => onSelect(null));

  // create devices
  content.select("#devices")
    .selectAll("g")
    .data(devices)
    .enter()
    .append("g")

    // translate to position
    .attr("transform", dev => "translate(" + Math.abs(dev.location?.x || 0) + " " + Math.abs(dev.location?.y || 0) + ")")

    // create single device
    .append("rect")
    .attr("width", 100)
    .attr("height", 100)
    .attr("x", 50)
    .attr("y", 50)
    .attr("fill", "teal")
    .on("click", (e, device) => onSelect(device));
}