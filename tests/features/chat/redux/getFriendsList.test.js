import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_GET_FRIENDS_LIST_BEGIN,
  CHAT_GET_FRIENDS_LIST_SUCCESS,
  CHAT_GET_FRIENDS_LIST_FAILURE,
  CHAT_GET_FRIENDS_LIST_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  getFriendsList,
  dismissGetFriendsListError,
  reducer,
} from '../../../../src/features/chat/redux/getFriendsList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/getFriendsList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getFriendsList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getFriendsList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_FRIENDS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_FRIENDS_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getFriendsList fails', () => {
    const store = mockStore({});

    return store.dispatch(getFriendsList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_FRIENDS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_FRIENDS_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetFriendsListError', () => {
    const expectedAction = {
      type: CHAT_GET_FRIENDS_LIST_DISMISS_ERROR,
    };
    expect(dismissGetFriendsListError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_GET_FRIENDS_LIST_BEGIN correctly', () => {
    const prevState = { getFriendsListPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_GET_FRIENDS_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getFriendsListPending).toBe(true);
  });

  it('handles action type CHAT_GET_FRIENDS_LIST_SUCCESS correctly', () => {
    const prevState = { getFriendsListPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_FRIENDS_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getFriendsListPending).toBe(false);
  });

  it('handles action type CHAT_GET_FRIENDS_LIST_FAILURE correctly', () => {
    const prevState = { getFriendsListPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_FRIENDS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getFriendsListPending).toBe(false);
    expect(state.getFriendsListError).toEqual(expect.anything());
  });

  it('handles action type CHAT_GET_FRIENDS_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getFriendsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_GET_FRIENDS_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getFriendsListError).toBe(null);
  });
});

