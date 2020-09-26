import React from 'react';
import './MenubarComponent.css';

/**
 * A simple menu bar
 */
export class MenubarComponent extends React.Component
{

  render()
  {
    return <div className={"topbar-container"}>
      <div className={"logo"}/>
      <div className={"spacer"}/>
      <div className={"profile"}/>
    </div>
  }

}
