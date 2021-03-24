import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/Home';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter as Router , Route, Switch} from 'react-router-dom';

ReactDOM.render(
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
