import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomeScene from 'ch/scenes/home';
import Error404Scene from 'ch/scenes/404';

import 'ch/utility/styles/layout.scss';
import 'ch/utility/styles/elements.scss';

const App = () => (
    <Switch>
        <Route exact path="/" render={() => <HomeScene />} />
        <Route component={Error404Scene} />
    </Switch>
);

export default App;
