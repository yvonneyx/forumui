import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_ACCEPT_INVITATION_BEGIN,
  CHAT_ACCEPT_INVITATION_SUCCESS,
  CHAT_ACCEPT_INVITATION_FAILURE,
  CHAT_ACCEPT_INVITATION_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  acceptInvitation,
  dismissAcceptInvitationError,
  reducer,
} from '../../../../src/features/chat/redux/acceptInvitation';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/acceptInvitation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when acceptInvitation succeeds', () => {
    const store = mockStore({});

    return store.dispatch(acceptInvitation())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_ACCEPT_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_ACCEPT_INVITATION_SUCCESS);
      });
  });

  it('dispatches failure action when acceptInvitation fails', () => {
    const store = mockStore({});

    return store.dispatch(acceptInvitation({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_ACCEPT_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_ACCEPT_INVITATION_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAcceptInvitationError', () => {
    const expectedAction = {
      type: CHAT_ACCEPT_INVITATION_DISMISS_ERROR,
    };
    expect(dismissAcceptInvitationError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_ACCEPT_INVITATION_BEGIN correctly', () => {
    const prevState = { acceptInvitationPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_ACCEPT_INVITATION_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.acceptInvitationPending).toBe(true);
  });

  it('handles action type CHAT_ACCEPT_INVITATION_SUCCESS correctly', () => {
    const prevState = { acceptInvitationPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_ACCEPT_INVITATION_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.acceptInvitationPending).toBe(false);
  });

  it('handles action type CHAT_ACCEPT_INVITATION_FAILURE correctly', () => {
    const prevState = { acceptInvitationPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_ACCEPT_INVITATION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.acceptInvitationPending).toBe(false);
    expect(state.acceptInvitationError).toEqual(expect.anything());
  });

  it('handles action type CHAT_ACCEPT_INVITATION_DISMISS_ERROR correctly', () => {
    const prevState = { acceptInvitationError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_ACCEPT_INVITATION_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.acceptInvitationError).toBe(null);
  });
});

