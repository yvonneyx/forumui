import React from 'react';
import { shallow } from 'enzyme';
import { ThemeSelection } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ThemeSelection />);
  expect(renderedComponent.find('.home-theme-selection').length).toBe(1);
});
