import React from 'react';
import { shallow } from 'enzyme';
import { SignupSuccess } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SignupSuccess />);
  expect(renderedComponent.find('.home-signup-success').length).toBe(1);
});
