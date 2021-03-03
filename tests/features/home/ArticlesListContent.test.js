import React from 'react';
import { shallow } from 'enzyme';
import { ArticlesListContent } from '../../../src/features/home/ArticlesListContent';

describe('home/ArticlesListContent', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ArticlesListContent {...props} />
    );

    expect(
      renderedComponent.find('.home-articles-list-content').length
    ).toBe(1);
  });
});
