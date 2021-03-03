import React from 'react';
import { shallow } from 'enzyme';
import { ArticlesPopulaires } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ArticlesPopulaires />);
  expect(renderedComponent.find('.home-articles-populaires').length).toBe(1);
});
