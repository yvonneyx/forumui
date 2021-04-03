import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_FIND_POST_BY_ID_BEGIN,
  POST_FIND_POST_BY_ID_SUCCESS,
  POST_FIND_POST_BY_ID_FAILURE,
  POST_FIND_POST_BY_ID_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  findPostById,
  dismissFindPostByIdError,
  reducer,
} from '../../../../src/features/post/redux/findPostById';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/findPostById', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findPostById succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findPostById())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_POST_BY_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_POST_BY_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findPostById fails', () => {
    const store = mockStore({});

    return store.dispatch(findPostById({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_POST_BY_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_POST_BY_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindPostByIdError', () => {
    const expectedAction = {
      type: POST_FIND_POST_BY_ID_DISMISS_ERROR,
    };
    expect(dismissFindPostByIdError()).toEqual(expectedAction);
  });

  it('handles action type POST_FIND_POST_BY_ID_BEGIN correctly', () => {
    const prevState = { findPostByIdPending: false };
    const state = reducer(
      prevState,
      { type: POST_FIND_POST_BY_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostByIdPending).toBe(true);
  });

  it('handles action type POST_FIND_POST_BY_ID_SUCCESS correctly', () => {
    const prevState = { findPostByIdPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_POST_BY_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostByIdPending).toBe(false);
  });

  it('handles action type POST_FIND_POST_BY_ID_FAILURE correctly', () => {
    const prevState = { findPostByIdPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_POST_BY_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostByIdPending).toBe(false);
    expect(state.findPostByIdError).toEqual(expect.anything());
  });

  it('handles action type POST_FIND_POST_BY_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findPostByIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_FIND_POST_BY_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostByIdError).toBe(null);
  });
});

