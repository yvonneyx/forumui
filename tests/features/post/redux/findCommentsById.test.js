import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_FIND_COMMENTS_BY_ID_BEGIN,
  POST_FIND_COMMENTS_BY_ID_SUCCESS,
  POST_FIND_COMMENTS_BY_ID_FAILURE,
  POST_FIND_COMMENTS_BY_ID_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  findCommentsById,
  dismissFindCommentsByIdError,
  reducer,
} from '../../../../src/features/post/redux/findCommentsById';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/findCommentsById', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findCommentsById succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findCommentsById())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_COMMENTS_BY_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_COMMENTS_BY_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findCommentsById fails', () => {
    const store = mockStore({});

    return store.dispatch(findCommentsById({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_COMMENTS_BY_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_COMMENTS_BY_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindCommentsByIdError', () => {
    const expectedAction = {
      type: POST_FIND_COMMENTS_BY_ID_DISMISS_ERROR,
    };
    expect(dismissFindCommentsByIdError()).toEqual(expectedAction);
  });

  it('handles action type POST_FIND_COMMENTS_BY_ID_BEGIN correctly', () => {
    const prevState = { findCommentsByIdPending: false };
    const state = reducer(
      prevState,
      { type: POST_FIND_COMMENTS_BY_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findCommentsByIdPending).toBe(true);
  });

  it('handles action type POST_FIND_COMMENTS_BY_ID_SUCCESS correctly', () => {
    const prevState = { findCommentsByIdPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_COMMENTS_BY_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findCommentsByIdPending).toBe(false);
  });

  it('handles action type POST_FIND_COMMENTS_BY_ID_FAILURE correctly', () => {
    const prevState = { findCommentsByIdPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_COMMENTS_BY_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findCommentsByIdPending).toBe(false);
    expect(state.findCommentsByIdError).toEqual(expect.anything());
  });

  it('handles action type POST_FIND_COMMENTS_BY_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findCommentsByIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_FIND_COMMENTS_BY_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findCommentsByIdError).toBe(null);
  });
});

