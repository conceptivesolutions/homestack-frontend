import React from 'react';
import './LayoutComponent.css'
import {LayoutGraph} from "./LayoutGraph";
import {getAllDevices, getDeviceByID, updateDevice} from '../../rest/DeviceClient';

/**
 * Component that will render the netplan chart as a network diagram
 */
export class LayoutComponent extends React.Component
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
      .map(({id, address, location}) =>
      {
        return {
          id,
          label: address,
          x: location.x,
          y: location.y
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
              to: deviceID
            }
          })
      })

    return (<LayoutGraph nodes={nodes} edges={edges} onMove={this._nodesMoved}/>)
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

}
