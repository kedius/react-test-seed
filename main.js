import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import sagaMiddleware from 'redux-saga';

import AccessControl from './src/utils/access-control';
import loggerMiddleware from './src/utils/logger';
import reducers from './src/reducers';
import saga from './src/sagas';

import SignIn from './src/components/sign-in';
import Dashboard from './src/components/dashboard';
import Page1 from './src/components/dashboard/first-page';
import Page2 from './src/components/dashboard/second-page';
import NoMatch from './src/components/no-match';

const store = createStore(
  reducers,
  applyMiddleware(
    loggerMiddleware,
    sagaMiddleware(saga)
  )
);

const accessControl = new AccessControl(store);

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path="/" component={ Dashboard } onEnter={ accessControl.require('USER') } >
        <IndexRedirect to="page1" />
        <Route path="page1" component={ Page1 } />
        <Route path="page2" component={ Page2 } />
      </Route>
      <Route path="/sign-in" component={SignIn} onEnter={ accessControl.except('USER') } />
      <Route path="*" component={ NoMatch } />
    </Router>
  </Provider>,
  document.getElementById('app')
);
