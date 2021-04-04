import React from 'react';
import { shallow } from 'enzyme';
import { CategoriesWidget } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CategoriesWidget />);
  expect(renderedComponent.find('.home-categories-widget').length).toBe(1);
});
