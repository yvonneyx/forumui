import React from 'react';
import { shallow } from 'enzyme';
import { UseDocumentScrollThrottled } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<UseDocumentScrollThrottled />);
  expect(renderedComponent.find('.common-use-document-scroll-throttled').length).toBe(1);
});
