import React from 'react';
import { shallow } from 'enzyme';
import { CreatePost } from '../../../src/features/post';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CreatePost />);
  expect(renderedComponent.find('.post-create-post').length).toBe(1);
});
