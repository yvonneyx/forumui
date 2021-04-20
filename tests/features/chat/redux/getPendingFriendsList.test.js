import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_GET_PENDING_FRIENDS_LIST_BEGIN,
  CHAT_GET_PENDING_FRIENDS_LIST_SUCCESS,
  CHAT_GET_PENDING_FRIENDS_LIST_FAILURE,
  CHAT_GET_PENDING_FRIENDS_LIST_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  getPendingFriendsList,
  dismissGetPendingFriendsListError,
  reducer,
} from '../../../../src/features/chat/redux/getPendingFriendsList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/getPendingFriendsList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getPendingFriendsList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getPendingFriendsList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_PENDING_FRIENDS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_PENDING_FRIENDS_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getPendingFriendsList fails', () => {
    const store = mockStore({});

    return store.dispatch(getPendingFriendsList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_PENDING_FRIENDS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_PENDING_FRIENDS_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetPendingFriendsListError', () => {
    const expectedAction = {
      type: CHAT_GET_PENDING_FRIENDS_LIST_DISMISS_ERROR,
    };
    expect(dismissGetPendingFriendsListError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_GET_PENDING_FRIENDS_LIST_BEGIN correctly', () => {
    const prevState = { getPendingFriendsListPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_GET_PENDING_FRIENDS_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getPendingFriendsListPending).toBe(true);
  });

  it('handles action type CHAT_GET_PENDING_FRIENDS_LIST_SUCCESS correctly', () => {
    const prevState = { getPendingFriendsListPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_PENDING_FRIENDS_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getPendingFriendsListPending).toBe(false);
  });

  it('handles action type CHAT_GET_PENDING_FRIENDS_LIST_FAILURE correctly', () => {
    const prevState = { getPendingFriendsListPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_PENDING_FRIENDS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getPendingFriendsListPending).toBe(false);
    expect(state.getPendingFriendsListError).toEqual(expect.anything());
  });

  it('handles action type CHAT_GET_PENDING_FRIENDS_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getPendingFriendsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_GET_PENDING_FRIENDS_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getPendingFriendsListError).toBe(null);
  });
});

