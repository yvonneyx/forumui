import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_QUERY_BEGIN,
  HOME_QUERY_SUCCESS,
  HOME_QUERY_FAILURE,
  HOME_QUERY_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  query,
  dismissQueryError,
  reducer,
} from '../../../../src/features/home/redux/query';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/query', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when query succeeds', () => {
    const store = mockStore({});

    return store.dispatch(query())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_QUERY_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_QUERY_SUCCESS);
      });
  });

  it('dispatches failure action when query fails', () => {
    const store = mockStore({});

    return store.dispatch(query({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_QUERY_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_QUERY_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissQueryError', () => {
    const expectedAction = {
      type: HOME_QUERY_DISMISS_ERROR,
    };
    expect(dismissQueryError()).toEqual(expectedAction);
  });

  it('handles action type HOME_QUERY_BEGIN correctly', () => {
    const prevState = { queryPending: false };
    const state = reducer(
      prevState,
      { type: HOME_QUERY_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.queryPending).toBe(true);
  });

  it('handles action type HOME_QUERY_SUCCESS correctly', () => {
    const prevState = { queryPending: true };
    const state = reducer(
      prevState,
      { type: HOME_QUERY_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.queryPending).toBe(false);
  });

  it('handles action type HOME_QUERY_FAILURE correctly', () => {
    const prevState = { queryPending: true };
    const state = reducer(
      prevState,
      { type: HOME_QUERY_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.queryPending).toBe(false);
    expect(state.queryError).toEqual(expect.anything());
  });

  it('handles action type HOME_QUERY_DISMISS_ERROR correctly', () => {
    const prevState = { queryError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_QUERY_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.queryError).toBe(null);
  });
});

