// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MainLayout from './layout/Main';

import AllViews from './views/AllViews';
import DemoView from './views/Demo';
import {DragOnCanvasView} from './views/Main';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import 'bootstrap/dist/js/bootstrap.js';
import './index.css';

export {default as colourButton} from "./components/Canvas/Form/buttonStyle.css"

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={AllViews} />
    </Route>
    <Route path="/demo" component={DemoView} />
    
    <Route path="/canvas" component={MainLayout}>
      <IndexRoute component={DragOnCanvasView} />
    </Route>
  </Router>,
  document.getElementById('root')
);
