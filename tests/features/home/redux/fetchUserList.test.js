import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FETCH_USER_LIST_BEGIN,
  HOME_FETCH_USER_LIST_SUCCESS,
  HOME_FETCH_USER_LIST_FAILURE,
  HOME_FETCH_USER_LIST_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  fetchUserList,
  dismissFetchUserListError,
  reducer,
} from '../../../../src/features/home/redux/fetchUserList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchUserList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchUserList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchUserList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_USER_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_USER_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when fetchUserList fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchUserList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_USER_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_USER_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchUserListError', () => {
    const expectedAction = {
      type: HOME_FETCH_USER_LIST_DISMISS_ERROR,
    };
    expect(dismissFetchUserListError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FETCH_USER_LIST_BEGIN correctly', () => {
    const prevState = { fetchUserListPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_USER_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserListPending).toBe(true);
  });

  it('handles action type HOME_FETCH_USER_LIST_SUCCESS correctly', () => {
    const prevState = { fetchUserListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_USER_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserListPending).toBe(false);
  });

  it('handles action type HOME_FETCH_USER_LIST_FAILURE correctly', () => {
    const prevState = { fetchUserListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_USER_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserListPending).toBe(false);
    expect(state.fetchUserListError).toEqual(expect.anything());
  });

  it('handles action type HOME_FETCH_USER_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchUserListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_USER_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUserListError).toBe(null);
  });
});

