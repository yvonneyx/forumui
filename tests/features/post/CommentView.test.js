import React from 'react';
import { shallow } from 'enzyme';
import { CommentView } from '../../../src/features/post/CommentView';

describe('post/CommentView', () => {
  it('renders node with correct class name', () => {
    const props = {
      post: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CommentView {...props} />
    );

    expect(
      renderedComponent.find('.post-comment-view').length
    ).toBe(1);
  });
});
