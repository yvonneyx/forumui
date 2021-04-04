import React from 'react';
import { shallow } from 'enzyme';
import { PostsListContent } from '../../../src/features/post/PostsListContent';

describe('post/PostsListContent', () => {
  it('renders node with correct class name', () => {
    const props = {
      post: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <PostsListContent {...props} />
    );

    expect(
      renderedComponent.find('.post-posts-list-content').length
    ).toBe(1);
  });
});
