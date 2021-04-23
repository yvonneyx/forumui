import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_GET_ALL_MSGS_BEGIN,
  CHAT_GET_ALL_MSGS_SUCCESS,
  CHAT_GET_ALL_MSGS_FAILURE,
  CHAT_GET_ALL_MSGS_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  getAllMsgs,
  dismissGetAllMsgsError,
  reducer,
} from '../../../../src/features/chat/redux/getAllMsgs';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/getAllMsgs', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAllMsgs succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAllMsgs())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_ALL_MSGS_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_ALL_MSGS_SUCCESS);
      });
  });

  it('dispatches failure action when getAllMsgs fails', () => {
    const store = mockStore({});

    return store.dispatch(getAllMsgs({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_ALL_MSGS_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_ALL_MSGS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAllMsgsError', () => {
    const expectedAction = {
      type: CHAT_GET_ALL_MSGS_DISMISS_ERROR,
    };
    expect(dismissGetAllMsgsError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_GET_ALL_MSGS_BEGIN correctly', () => {
    const prevState = { getAllMsgsPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_GET_ALL_MSGS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAllMsgsPending).toBe(true);
  });

  it('handles action type CHAT_GET_ALL_MSGS_SUCCESS correctly', () => {
    const prevState = { getAllMsgsPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_ALL_MSGS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAllMsgsPending).toBe(false);
  });

  it('handles action type CHAT_GET_ALL_MSGS_FAILURE correctly', () => {
    const prevState = { getAllMsgsPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_ALL_MSGS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAllMsgsPending).toBe(false);
    expect(state.getAllMsgsError).toEqual(expect.anything());
  });

  it('handles action type CHAT_GET_ALL_MSGS_DISMISS_ERROR correctly', () => {
    const prevState = { getAllMsgsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_GET_ALL_MSGS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAllMsgsError).toBe(null);
  });
});

