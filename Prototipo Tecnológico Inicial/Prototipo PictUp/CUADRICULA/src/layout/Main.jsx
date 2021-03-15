// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NavLayout from './Nav';

class MainLayout extends Component {
  render() {
     return ( 
      <div className="">
        <div className="">
          {/* <h1 className="slds-nav-vertical__title slds-text-title_caps">
              ABER EL INDEX¿
          </h1> */}
          {/* <NavLayout currentPath={this.props.location.pathname} /> */}
        </div>
        <div>
          <main className="">
              {React.cloneElement(this.props.children, {})}
          </main>
        </div>
      </div>
    )
  }
}

MainLayout.propTypes = {
  children: PropTypes.node,
}

export default MainLayout
