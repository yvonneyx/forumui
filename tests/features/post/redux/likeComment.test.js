import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_LIKE_COMMENT_BEGIN,
  POST_LIKE_COMMENT_SUCCESS,
  POST_LIKE_COMMENT_FAILURE,
  POST_LIKE_COMMENT_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  likeComment,
  dismissLikeCommentError,
  reducer,
} from '../../../../src/features/post/redux/likeComment';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/likeComment', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when likeComment succeeds', () => {
    const store = mockStore({});

    return store.dispatch(likeComment())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_LIKE_COMMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_LIKE_COMMENT_SUCCESS);
      });
  });

  it('dispatches failure action when likeComment fails', () => {
    const store = mockStore({});

    return store.dispatch(likeComment({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_LIKE_COMMENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_LIKE_COMMENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissLikeCommentError', () => {
    const expectedAction = {
      type: POST_LIKE_COMMENT_DISMISS_ERROR,
    };
    expect(dismissLikeCommentError()).toEqual(expectedAction);
  });

  it('handles action type POST_LIKE_COMMENT_BEGIN correctly', () => {
    const prevState = { likeCommentPending: false };
    const state = reducer(
      prevState,
      { type: POST_LIKE_COMMENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.likeCommentPending).toBe(true);
  });

  it('handles action type POST_LIKE_COMMENT_SUCCESS correctly', () => {
    const prevState = { likeCommentPending: true };
    const state = reducer(
      prevState,
      { type: POST_LIKE_COMMENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.likeCommentPending).toBe(false);
  });

  it('handles action type POST_LIKE_COMMENT_FAILURE correctly', () => {
    const prevState = { likeCommentPending: true };
    const state = reducer(
      prevState,
      { type: POST_LIKE_COMMENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.likeCommentPending).toBe(false);
    expect(state.likeCommentError).toEqual(expect.anything());
  });

  it('handles action type POST_LIKE_COMMENT_DISMISS_ERROR correctly', () => {
    const prevState = { likeCommentError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_LIKE_COMMENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.likeCommentError).toBe(null);
  });
});

