import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_GET_LATEST_MSGS_LIST_BEGIN,
  CHAT_GET_LATEST_MSGS_LIST_SUCCESS,
  CHAT_GET_LATEST_MSGS_LIST_FAILURE,
  CHAT_GET_LATEST_MSGS_LIST_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  getLatestMsgsList,
  dismissGetLatestMsgsListError,
  reducer,
} from '../../../../src/features/chat/redux/getLatestMsgsList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/getLatestMsgsList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getLatestMsgsList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getLatestMsgsList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_LATEST_MSGS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_LATEST_MSGS_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getLatestMsgsList fails', () => {
    const store = mockStore({});

    return store.dispatch(getLatestMsgsList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_LATEST_MSGS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_LATEST_MSGS_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetLatestMsgsListError', () => {
    const expectedAction = {
      type: CHAT_GET_LATEST_MSGS_LIST_DISMISS_ERROR,
    };
    expect(dismissGetLatestMsgsListError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_GET_LATEST_MSGS_LIST_BEGIN correctly', () => {
    const prevState = { getLatestMsgsListPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_GET_LATEST_MSGS_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLatestMsgsListPending).toBe(true);
  });

  it('handles action type CHAT_GET_LATEST_MSGS_LIST_SUCCESS correctly', () => {
    const prevState = { getLatestMsgsListPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_LATEST_MSGS_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLatestMsgsListPending).toBe(false);
  });

  it('handles action type CHAT_GET_LATEST_MSGS_LIST_FAILURE correctly', () => {
    const prevState = { getLatestMsgsListPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_LATEST_MSGS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLatestMsgsListPending).toBe(false);
    expect(state.getLatestMsgsListError).toEqual(expect.anything());
  });

  it('handles action type CHAT_GET_LATEST_MSGS_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getLatestMsgsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_GET_LATEST_MSGS_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getLatestMsgsListError).toBe(null);
  });
});

