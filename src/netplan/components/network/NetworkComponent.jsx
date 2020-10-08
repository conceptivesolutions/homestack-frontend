import React, {useEffect, useState} from 'react';
import './NetworkComponent.scss'
import {NetworkGraph} from "./NetworkGraph";
import {getAllDevices, getDeviceByID, updateDevice} from '../../rest/DeviceClient';
import {useGlobalHook} from "@devhammed/use-global-hook";

/**
 * Component that will render the netplan chart as a network diagram
 */
export default () =>
{
  const {showDialog} = useGlobalHook("dialogStore");
  const [devices, setDevices] = useState([]);

  // Load all devices into state
  useEffect(() =>
  {
    // noinspection JSCheckFunctionSignatures
    getAllDevices().then((data) => setDevices(data));
  }, [])

  /**
   * This method gets called, if the positions of nodes
   * have been moved and should be updated on remote
   *
   * @param pPositions Object with {nodeID: {x: 99, y: 99}}
   * @private
   */
  const _nodesMoved = (pPositions) =>
  {
    Object.keys(pPositions)
      .forEach(pNodeID =>
      {
        getDeviceByID(pNodeID).then(pDevice =>
        {
          if (pDevice !== undefined)
          {
            pDevice.location = pPositions[pNodeID];
            pDevice.metrics = null;

            // noinspection JSIgnoredPromiseFromCall
            updateDevice(pDevice)
          }
        })
      })
  }

  /**
   * Returns the color for a given device state
   *
   * @param pDevice device to check
   * @returns {string} color als hex string
   * @private
   */
  const _getStateColor = (pDevice) =>
  {
    if (pDevice.metrics === undefined)
      return "#737373";

    let failed = [];
    let success = [];

    pDevice.metrics.forEach(pMetric =>
    {
      if (pMetric.state === "SUCCESS")
        success.push(pMetric);
      else
        failed.push(pMetric);
    })

    if (failed.length > 0 && success.length === 0)
      return "#dd0404";
    else if (failed.length > 0 && success.length > 0)
      return "#fffb03";
    else
      return "#4bbf04"
  }

  /**
   * Converts a netplan device to the correct vis.js node
   */
  const deviceToNode = pDevice => ({
    id: pDevice.id,
    label: pDevice.address,
    x: pDevice.location === undefined ? 0 : pDevice.location.x,
    y: pDevice.location === undefined ? 0 : pDevice.location.y,
    shape: 'icon',
    icon: {
      face: '"Font Awesome 5 Free"',
      code: '\uf6ff',
      size: 30,
      color: _getStateColor(pDevice)
    },
    shadow: {
      enabled: true,
      x: 2,
      y: 2,
      size: 5,
    },
  });

  /**
   * Extracts vis.js edges from netplan devices
   */
  const deviceToEdge = ({id, edges}) =>
  {
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
  };

  return (
    <NetworkGraph nodes={devices.map(deviceToNode)}
                  edges={devices.flatMap(deviceToEdge)}
                  onMove={_nodesMoved}/>
  );
}

