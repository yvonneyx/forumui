import React from 'react';
import { shallow } from 'enzyme';
import { PostsListByUser } from '../../../src/features/post/PostsListByUser';

describe('post/PostsListByUser', () => {
  it('renders node with correct class name', () => {
    const props = {
      post: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <PostsListByUser {...props} />
    );

    expect(
      renderedComponent.find('.post-posts-list-by-user').length
    ).toBe(1);
  });
});
