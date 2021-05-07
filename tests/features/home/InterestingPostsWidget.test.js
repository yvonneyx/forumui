import React from 'react';
import { shallow } from 'enzyme';
import { InterestingPostsWidget } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InterestingPostsWidget />);
  expect(renderedComponent.find('.home-interesting-posts-widget').length).toBe(1);
});
