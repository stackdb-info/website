import * as React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { TypePage } from './pages/TypePage';
import { Categories } from './pages/Categories';
import { TechnoPage } from './pages/TechnoPage';

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/:type/:techno">
            <TechnoPage />
          </Route>
          <Route path="/:type">
            <TypePage />
          </Route>
          <Route path="/">
            <Categories />
          </Route>
        </Switch>
      </div>
    </Router>)
}

export default App;
