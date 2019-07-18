import React from 'react';
import { PropTypes } from 'prop-types';

const Meable = (ComponentToWrap) => {
    const MeableComponent = (props, context) => (
        <ComponentToWrap {...props} me={context.me} />
    );

    MeableComponent.contextTypes = {
        me: PropTypes.object.isRequired,
    };

    return MeableComponent;
};

export default Meable;
