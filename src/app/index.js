import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import HomeScene from 'ch/scenes/home';

import 'ch/utility/styles/layout.scss';
import 'ch/utility/styles/elements.scss';

const App = () => (
    <BrowserRouter>
        <Route exact path="/" render={() => <HomeScene />} />
    </BrowserRouter>
);

export default App;
