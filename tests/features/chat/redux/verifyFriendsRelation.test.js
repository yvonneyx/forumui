import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_VERIFY_FRIENDS_RELATION_BEGIN,
  CHAT_VERIFY_FRIENDS_RELATION_SUCCESS,
  CHAT_VERIFY_FRIENDS_RELATION_FAILURE,
  CHAT_VERIFY_FRIENDS_RELATION_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  verifyFriendsRelation,
  dismissVerifyFriendsRelationError,
  reducer,
} from '../../../../src/features/chat/redux/verifyFriendsRelation';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/verifyFriendsRelation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when verifyFriendsRelation succeeds', () => {
    const store = mockStore({});

    return store.dispatch(verifyFriendsRelation())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_VERIFY_FRIENDS_RELATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_VERIFY_FRIENDS_RELATION_SUCCESS);
      });
  });

  it('dispatches failure action when verifyFriendsRelation fails', () => {
    const store = mockStore({});

    return store.dispatch(verifyFriendsRelation({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_VERIFY_FRIENDS_RELATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_VERIFY_FRIENDS_RELATION_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissVerifyFriendsRelationError', () => {
    const expectedAction = {
      type: CHAT_VERIFY_FRIENDS_RELATION_DISMISS_ERROR,
    };
    expect(dismissVerifyFriendsRelationError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_VERIFY_FRIENDS_RELATION_BEGIN correctly', () => {
    const prevState = { verifyFriendsRelationPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_VERIFY_FRIENDS_RELATION_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.verifyFriendsRelationPending).toBe(true);
  });

  it('handles action type CHAT_VERIFY_FRIENDS_RELATION_SUCCESS correctly', () => {
    const prevState = { verifyFriendsRelationPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_VERIFY_FRIENDS_RELATION_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.verifyFriendsRelationPending).toBe(false);
  });

  it('handles action type CHAT_VERIFY_FRIENDS_RELATION_FAILURE correctly', () => {
    const prevState = { verifyFriendsRelationPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_VERIFY_FRIENDS_RELATION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.verifyFriendsRelationPending).toBe(false);
    expect(state.verifyFriendsRelationError).toEqual(expect.anything());
  });

  it('handles action type CHAT_VERIFY_FRIENDS_RELATION_DISMISS_ERROR correctly', () => {
    const prevState = { verifyFriendsRelationError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_VERIFY_FRIENDS_RELATION_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.verifyFriendsRelationError).toBe(null);
  });
});

