import React from 'react';
import { shallow } from 'enzyme';
import { ArticlesListTab } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ArticlesListTab />);
  expect(renderedComponent.find('.home-articles-list').length).toBe(1);
});
