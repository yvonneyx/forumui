import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_CREATE_POST_BEGIN,
  POST_CREATE_POST_SUCCESS,
  POST_CREATE_POST_FAILURE,
  POST_CREATE_POST_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  createPost,
  dismissCreatePostError,
  reducer,
} from '../../../../src/features/post/redux/createPost';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/createPost', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createPost succeeds', () => {
    const store = mockStore({});

    return store.dispatch(createPost())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_CREATE_POST_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_CREATE_POST_SUCCESS);
      });
  });

  it('dispatches failure action when createPost fails', () => {
    const store = mockStore({});

    return store.dispatch(createPost({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_CREATE_POST_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_CREATE_POST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreatePostError', () => {
    const expectedAction = {
      type: POST_CREATE_POST_DISMISS_ERROR,
    };
    expect(dismissCreatePostError()).toEqual(expectedAction);
  });

  it('handles action type POST_CREATE_POST_BEGIN correctly', () => {
    const prevState = { createPostPending: false };
    const state = reducer(
      prevState,
      { type: POST_CREATE_POST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createPostPending).toBe(true);
  });

  it('handles action type POST_CREATE_POST_SUCCESS correctly', () => {
    const prevState = { createPostPending: true };
    const state = reducer(
      prevState,
      { type: POST_CREATE_POST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createPostPending).toBe(false);
  });

  it('handles action type POST_CREATE_POST_FAILURE correctly', () => {
    const prevState = { createPostPending: true };
    const state = reducer(
      prevState,
      { type: POST_CREATE_POST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createPostPending).toBe(false);
    expect(state.createPostError).toEqual(expect.anything());
  });

  it('handles action type POST_CREATE_POST_DISMISS_ERROR correctly', () => {
    const prevState = { createPostError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_CREATE_POST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createPostError).toBe(null);
  });
});

