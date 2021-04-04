import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_FIND_POSTS_BY_USER_ID_BEGIN,
  POST_FIND_POSTS_BY_USER_ID_SUCCESS,
  POST_FIND_POSTS_BY_USER_ID_FAILURE,
  POST_FIND_POSTS_BY_USER_ID_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  findPostsByUserId,
  dismissFindPostsByUserIdError,
  reducer,
} from '../../../../src/features/post/redux/findPostsByUserId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/findPostsByUserId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findPostsByUserId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findPostsByUserId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_POSTS_BY_USER_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_POSTS_BY_USER_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findPostsByUserId fails', () => {
    const store = mockStore({});

    return store.dispatch(findPostsByUserId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_POSTS_BY_USER_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_POSTS_BY_USER_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindPostsByUserIdError', () => {
    const expectedAction = {
      type: POST_FIND_POSTS_BY_USER_ID_DISMISS_ERROR,
    };
    expect(dismissFindPostsByUserIdError()).toEqual(expectedAction);
  });

  it('handles action type POST_FIND_POSTS_BY_USER_ID_BEGIN correctly', () => {
    const prevState = { findPostsByUserIdPending: false };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_USER_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByUserIdPending).toBe(true);
  });

  it('handles action type POST_FIND_POSTS_BY_USER_ID_SUCCESS correctly', () => {
    const prevState = { findPostsByUserIdPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_USER_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByUserIdPending).toBe(false);
  });

  it('handles action type POST_FIND_POSTS_BY_USER_ID_FAILURE correctly', () => {
    const prevState = { findPostsByUserIdPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_USER_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByUserIdPending).toBe(false);
    expect(state.findPostsByUserIdError).toEqual(expect.anything());
  });

  it('handles action type POST_FIND_POSTS_BY_USER_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findPostsByUserIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_USER_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByUserIdError).toBe(null);
  });
});

