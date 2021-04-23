import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  CHAT_GET_ALL_OFFLINES_BEGIN,
  CHAT_GET_ALL_OFFLINES_SUCCESS,
  CHAT_GET_ALL_OFFLINES_FAILURE,
  CHAT_GET_ALL_OFFLINES_DISMISS_ERROR,
} from '../../../../src/features/chat/redux/constants';

import {
  getAllOfflines,
  dismissGetAllOfflinesError,
  reducer,
} from '../../../../src/features/chat/redux/getAllOfflines';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('chat/redux/getAllOfflines', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getAllOfflines succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getAllOfflines())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_ALL_OFFLINES_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_ALL_OFFLINES_SUCCESS);
      });
  });

  it('dispatches failure action when getAllOfflines fails', () => {
    const store = mockStore({});

    return store.dispatch(getAllOfflines({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', CHAT_GET_ALL_OFFLINES_BEGIN);
        expect(actions[1]).toHaveProperty('type', CHAT_GET_ALL_OFFLINES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetAllOfflinesError', () => {
    const expectedAction = {
      type: CHAT_GET_ALL_OFFLINES_DISMISS_ERROR,
    };
    expect(dismissGetAllOfflinesError()).toEqual(expectedAction);
  });

  it('handles action type CHAT_GET_ALL_OFFLINES_BEGIN correctly', () => {
    const prevState = { getAllOfflinesPending: false };
    const state = reducer(
      prevState,
      { type: CHAT_GET_ALL_OFFLINES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAllOfflinesPending).toBe(true);
  });

  it('handles action type CHAT_GET_ALL_OFFLINES_SUCCESS correctly', () => {
    const prevState = { getAllOfflinesPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_ALL_OFFLINES_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAllOfflinesPending).toBe(false);
  });

  it('handles action type CHAT_GET_ALL_OFFLINES_FAILURE correctly', () => {
    const prevState = { getAllOfflinesPending: true };
    const state = reducer(
      prevState,
      { type: CHAT_GET_ALL_OFFLINES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAllOfflinesPending).toBe(false);
    expect(state.getAllOfflinesError).toEqual(expect.anything());
  });

  it('handles action type CHAT_GET_ALL_OFFLINES_DISMISS_ERROR correctly', () => {
    const prevState = { getAllOfflinesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CHAT_GET_ALL_OFFLINES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getAllOfflinesError).toBe(null);
  });
});

