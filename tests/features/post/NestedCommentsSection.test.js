import React from 'react';
import { shallow } from 'enzyme';
import { NestedCommentsSection } from '../../../src/features/post';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<NestedCommentsSection />);
  expect(renderedComponent.find('.post-nested-comments-view').length).toBe(1);
});
