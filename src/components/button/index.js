import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import styles from './styles.scss';

const Button = (props) => {
    const rootClass = classNames(
        styles.root,
        props.isDisabled ? styles.rootDisabled : null,
    );

    if (props.to) {
        return (
            <Link to={props.to} className={rootClass}>{props.children}</Link>
        );
    }

    return (
        <button id={props.buttonId} type="button" onClick={e => props.onClick(e)} className={rootClass} disabled={props.isDisabled}>
            {props.children}
        </button>
    );
};

Button.propTypes = {
    to: PropTypes.string,
    buttonId: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    isDisabled: PropTypes.bool,
};

Button.defaultProps = {
    to: null,
    buttonId: '',
    onClick: () => null,
    isDisabled: false,
};

export default Button;
