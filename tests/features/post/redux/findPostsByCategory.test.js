import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_FIND_POSTS_BY_CATEGORY_BEGIN,
  POST_FIND_POSTS_BY_CATEGORY_SUCCESS,
  POST_FIND_POSTS_BY_CATEGORY_FAILURE,
  POST_FIND_POSTS_BY_CATEGORY_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  findPostsByCategory,
  dismissFindPostsByCategoryError,
  reducer,
} from '../../../../src/features/post/redux/findPostsByCategory';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/findPostsByCategory', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findPostsByCategory succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findPostsByCategory())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_POSTS_BY_CATEGORY_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_POSTS_BY_CATEGORY_SUCCESS);
      });
  });

  it('dispatches failure action when findPostsByCategory fails', () => {
    const store = mockStore({});

    return store.dispatch(findPostsByCategory({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_POSTS_BY_CATEGORY_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_POSTS_BY_CATEGORY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindPostsByCategoryError', () => {
    const expectedAction = {
      type: POST_FIND_POSTS_BY_CATEGORY_DISMISS_ERROR,
    };
    expect(dismissFindPostsByCategoryError()).toEqual(expectedAction);
  });

  it('handles action type POST_FIND_POSTS_BY_CATEGORY_BEGIN correctly', () => {
    const prevState = { findPostsByCategoryPending: false };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_CATEGORY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByCategoryPending).toBe(true);
  });

  it('handles action type POST_FIND_POSTS_BY_CATEGORY_SUCCESS correctly', () => {
    const prevState = { findPostsByCategoryPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_CATEGORY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByCategoryPending).toBe(false);
  });

  it('handles action type POST_FIND_POSTS_BY_CATEGORY_FAILURE correctly', () => {
    const prevState = { findPostsByCategoryPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_CATEGORY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByCategoryPending).toBe(false);
    expect(state.findPostsByCategoryError).toEqual(expect.anything());
  });

  it('handles action type POST_FIND_POSTS_BY_CATEGORY_DISMISS_ERROR correctly', () => {
    const prevState = { findPostsByCategoryError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_CATEGORY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByCategoryError).toBe(null);
  });
});

