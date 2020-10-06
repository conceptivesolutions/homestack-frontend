import React from 'react';
import './NetworkComponent.css'
import {NetworkGraph} from "./NetworkGraph";
import {getAllDevices, getDeviceByID, updateDevice} from '../../rest/DeviceClient';

/**
 * Component that will render the netplan chart as a network diagram
 */
export class NetworkComponent extends React.Component
{

  state = {
    devices: [],
  }

  componentDidMount()
  {
    // Load all devices into state
    getAllDevices().then((data) =>
    {
      this.setState({
        devices: data
      })
    })
  }

  render()
  {
    let {devices} = this.state;
    let nodes = devices
      .map((device) =>
      {
        return {
          id: device.id,
          label: device.address,
          x: device.location === undefined ? 0 : device.location.x,
          y: device.location === undefined ? 0 : device.location.y,
          shape: 'icon',
          icon: {
            face: '"Font Awesome 5 Free"',
            code: '\uf6ff',
            size: 30,
            color: this._getStateColor(device)
          },
          shadow: {
            enabled: true,
            x: 2,
            y: 2,
            size: 5,
          },
        }
      })

    let edges = devices
      .flatMap(({id, edges}) =>
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
      })

    return (<NetworkGraph nodes={nodes} edges={edges} onMove={this._nodesMoved}/>)
  }

  /**
   * This method gets called, if the positions of nodes
   * have been moved and should be updated on remote
   *
   * @param pPositions Object with {nodeID: {x: 99, y: 99}}
   * @private
   */
  _nodesMoved(pPositions)
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
  _getStateColor(pDevice)
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

}
