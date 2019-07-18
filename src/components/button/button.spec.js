import React from 'react';
import { shallow } from 'enzyme';

import { Link } from 'react-router-dom';

import Button from './index';

describe('Button', () => {
    it('should render', () => {
        expect(shallow(<Button>Lorem</Button>)).toMatchSnapshot();
    });
    it('should render text', () => {
        expect(shallow(<Button>Lorem</Button>).text()).toBe('Lorem');
    });
    it('should have a default onClick', () => {
        expect(Button.defaultProps.onClick()).toBe(null);
    });
    it('should be disabled', () => {
        const component = shallow(<Button isDisabled>Lorem</Button>);
        expect(component.prop('disabled')).toBe(true);
    });
    it('should render link', () => {
        const component = shallow(<Button to="lorem">Lorem</Button>);
        expect(component.type()).toBe(Link);
        expect(component.prop('to')).toBe('lorem');
    });
    it('should handle click', () => {
        let number = 0;
        const component = shallow(<Button onClick={() => { number += 1; }}>Lorem</Button>);

        expect(number).toBe(0);
        component.simulate('click');
        expect(number).toBe(1);
    });
});
