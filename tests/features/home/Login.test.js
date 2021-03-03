import React from 'react';
import { shallow } from 'enzyme';
import { Login } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Login />);
  expect(renderedComponent.find('.home-login').length).toBe(1);
});
