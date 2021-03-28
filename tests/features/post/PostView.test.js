import React from 'react';
import { shallow } from 'enzyme';
import { PostView } from '../../../src/features/post';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PostView />);
  expect(renderedComponent.find('.post-post-view').length).toBe(1);
});
