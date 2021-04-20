import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_SEND_INVITATION_BEGIN,
  CHAT_SEND_INVITATION_SUCCESS,
  CHAT_SEND_INVITATION_FAILURE,
  CHAT_SEND_INVITATION_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  sendInvitation,
  dismissSendInvitationError,
  reducer,
} from '../../../../src/features/chat/redux/sendInvitation';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/sendInvitation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when sendInvitation succeeds', () => {
    const store = mockStore({});

    return store.dispatch(sendInvitation())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_SEND_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_SEND_INVITATION_SUCCESS);
      });
  });

  it('dispatches failure action when sendInvitation fails', () => {
    const store = mockStore({});

    return store.dispatch(sendInvitation({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_SEND_INVITATION_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_SEND_INVITATION_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSendInvitationError', () => {
    const expectedAction = {
      type: CHAT_SEND_INVITATION_DISMISS_ERROR,
    };
    expect(dismissSendInvitationError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_SEND_INVITATION_BEGIN correctly', () => {
    const prevState = { sendInvitationPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_SEND_INVITATION_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.sendInvitationPending).toBe(true);
  });

  it('handles action type CHAT_SEND_INVITATION_SUCCESS correctly', () => {
    const prevState = { sendInvitationPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_SEND_INVITATION_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.sendInvitationPending).toBe(false);
  });

  it('handles action type CHAT_SEND_INVITATION_FAILURE correctly', () => {
    const prevState = { sendInvitationPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_SEND_INVITATION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.sendInvitationPending).toBe(false);
    expect(state.sendInvitationError).toEqual(expect.anything());
  });

  it('handles action type CHAT_SEND_INVITATION_DISMISS_ERROR correctly', () => {
    const prevState = { sendInvitationError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_SEND_INVITATION_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.sendInvitationError).toBe(null);
  });
});

