import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_FIND_HOT_POSTS_BEGIN,
  POST_FIND_HOT_POSTS_SUCCESS,
  POST_FIND_HOT_POSTS_FAILURE,
  POST_FIND_HOT_POSTS_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  findHotPosts,
  dismissFindHotPostsError,
  reducer,
} from '../../../../src/features/post/redux/findHotPosts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/findHotPosts', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findHotPosts succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findHotPosts())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_HOT_POSTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_HOT_POSTS_SUCCESS);
      });
  });

  it('dispatches failure action when findHotPosts fails', () => {
    const store = mockStore({});

    return store.dispatch(findHotPosts({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_HOT_POSTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_HOT_POSTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindHotPostsError', () => {
    const expectedAction = {
      type: POST_FIND_HOT_POSTS_DISMISS_ERROR,
    };
    expect(dismissFindHotPostsError()).toEqual(expectedAction);
  });

  it('handles action type POST_FIND_HOT_POSTS_BEGIN correctly', () => {
    const prevState = { findHotPostsPending: false };
    const state = reducer(
      prevState,
      { type: POST_FIND_HOT_POSTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findHotPostsPending).toBe(true);
  });

  it('handles action type POST_FIND_HOT_POSTS_SUCCESS correctly', () => {
    const prevState = { findHotPostsPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_HOT_POSTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findHotPostsPending).toBe(false);
  });

  it('handles action type POST_FIND_HOT_POSTS_FAILURE correctly', () => {
    const prevState = { findHotPostsPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_HOT_POSTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findHotPostsPending).toBe(false);
    expect(state.findHotPostsError).toEqual(expect.anything());
  });

  it('handles action type POST_FIND_HOT_POSTS_DISMISS_ERROR correctly', () => {
    const prevState = { findHotPostsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_FIND_HOT_POSTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findHotPostsError).toBe(null);
  });
});

