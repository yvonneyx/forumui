import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_REMOVE_INVITATION_BEGIN,
  CHAT_REMOVE_INVITATION_SUCCESS,
  CHAT_REMOVE_INVITATION_FAILURE,
  CHAT_REMOVE_INVITATION_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  removeInvitation,
  dismissRemoveInvitationError,
  reducer,
} from '../../../../src/features/chat/redux/removeInvitation';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/removeInvitation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when removeInvitation succeeds', () => {
    const store = mockStore({});

    return store.dispatch(removeInvitation())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_REMOVE_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_REMOVE_INVITATION_SUCCESS);
      });
  });

  it('dispatches failure action when removeInvitation fails', () => {
    const store = mockStore({});

    return store.dispatch(removeInvitation({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_REMOVE_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_REMOVE_INVITATION_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissRemoveInvitationError', () => {
    const expectedAction = {
      type: CHAT_REMOVE_INVITATION_DISMISS_ERROR,
    };
    expect(dismissRemoveInvitationError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_REMOVE_INVITATION_BEGIN correctly', () => {
    const prevState = { removeInvitationPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_REMOVE_INVITATION_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.removeInvitationPending).toBe(true);
  });

  it('handles action type CHAT_REMOVE_INVITATION_SUCCESS correctly', () => {
    const prevState = { removeInvitationPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_REMOVE_INVITATION_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.removeInvitationPending).toBe(false);
  });

  it('handles action type CHAT_REMOVE_INVITATION_FAILURE correctly', () => {
    const prevState = { removeInvitationPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_REMOVE_INVITATION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.removeInvitationPending).toBe(false);
    expect(state.removeInvitationError).toEqual(expect.anything());
  });

  it('handles action type CHAT_REMOVE_INVITATION_DISMISS_ERROR correctly', () => {
    const prevState = { removeInvitationError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_REMOVE_INVITATION_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.removeInvitationError).toBe(null);
  });
});

