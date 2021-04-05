import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_CREATE_A_COMMENT_BEGIN,
  POST_CREATE_A_COMMENT_SUCCESS,
  POST_CREATE_A_COMMENT_FAILURE,
  POST_CREATE_A_COMMENT_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  createAComment,
  dismissCreateACommentError,
  reducer,
} from '../../../../src/features/post/redux/createAComment';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/createAComment', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createAComment succeeds', () => {
    const store = mockStore({});

    return store.dispatch(createAComment())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_CREATE_A_COMMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_CREATE_A_COMMENT_SUCCESS);
      });
  });

  it('dispatches failure action when createAComment fails', () => {
    const store = mockStore({});

    return store.dispatch(createAComment({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_CREATE_A_COMMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_CREATE_A_COMMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreateACommentError', () => {
    const expectedAction = {
      type: POST_CREATE_A_COMMENT_DISMISS_ERROR,
    };
    expect(dismissCreateACommentError()).toEqual(expectedAction);
  });

  it('handles action type POST_CREATE_A_COMMENT_BEGIN correctly', () => {
    const prevState = { createACommentPending: false };
    const state = reducer(
      prevState,
      { type: POST_CREATE_A_COMMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createACommentPending).toBe(true);
  });

  it('handles action type POST_CREATE_A_COMMENT_SUCCESS correctly', () => {
    const prevState = { createACommentPending: true };
    const state = reducer(
      prevState,
      { type: POST_CREATE_A_COMMENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createACommentPending).toBe(false);
  });

  it('handles action type POST_CREATE_A_COMMENT_FAILURE correctly', () => {
    const prevState = { createACommentPending: true };
    const state = reducer(
      prevState,
      { type: POST_CREATE_A_COMMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createACommentPending).toBe(false);
    expect(state.createACommentError).toEqual(expect.anything());
  });

  it('handles action type POST_CREATE_A_COMMENT_DISMISS_ERROR correctly', () => {
    const prevState = { createACommentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_CREATE_A_COMMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createACommentError).toBe(null);
  });
});

