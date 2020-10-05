import React from "react";
import {MDBIcon, MDBSideNav, MDBSideNavItem} from "mdbreact";

export class NavigationComponent extends React.Component
{

  render()
  {
    return (<MDBSideNav logo="/300_dark.png" breakWidth={0} mask="strong" fixed
                        bg="https://previews.123rf.com/images/ktsdesign/ktsdesign1704/ktsdesign170400031/76059808-3d-darstellung-geprägtes-netz-das-internetverbindungen-cloud-computing-und-neuronales-netzwerk-darstel.jpg">

      <MDBSideNavItem className="border-bottom-1"><MDBIcon icon="user" className="mr-2"/>Login</MDBSideNavItem>
      {/*<MDBSideNavNav>*/}
      {/*  <MDBSideNavCat name="Submit blog" id="submit-blog-cat" icon="chevron-right">*/}
      {/*    <MDBSideNavItem>Submit listing</MDBSideNavItem>*/}
      {/*    <MDBSideNavItem>Registration form</MDBSideNavItem>*/}
      {/*  </MDBSideNavCat>*/}
      {/*</MDBSideNavNav>*/}
    </MDBSideNav>)
  }

}
