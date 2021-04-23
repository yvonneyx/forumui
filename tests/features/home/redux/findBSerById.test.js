import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FIND_B_SER_BY_ID_BEGIN,
  HOME_FIND_B_SER_BY_ID_SUCCESS,
  HOME_FIND_B_SER_BY_ID_FAILURE,
  HOME_FIND_B_SER_BY_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  findBSerById,
  dismissFindBSerByIdError,
  reducer,
} from '../../../../src/features/home/redux/findBSerById';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/findBSerById', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findBSerById succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findBSerById())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_B_SER_BY_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_B_SER_BY_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findBSerById fails', () => {
    const store = mockStore({});

    return store.dispatch(findBSerById({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_B_SER_BY_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_B_SER_BY_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindBSerByIdError', () => {
    const expectedAction = {
      type: HOME_FIND_B_SER_BY_ID_DISMISS_ERROR,
    };
    expect(dismissFindBSerByIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FIND_B_SER_BY_ID_BEGIN correctly', () => {
    const prevState = { findBSerByIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FIND_B_SER_BY_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findBSerByIdPending).toBe(true);
  });

  it('handles action type HOME_FIND_B_SER_BY_ID_SUCCESS correctly', () => {
    const prevState = { findBSerByIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_B_SER_BY_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findBSerByIdPending).toBe(false);
  });

  it('handles action type HOME_FIND_B_SER_BY_ID_FAILURE correctly', () => {
    const prevState = { findBSerByIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_B_SER_BY_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findBSerByIdPending).toBe(false);
    expect(state.findBSerByIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_FIND_B_SER_BY_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findBSerByIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FIND_B_SER_BY_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findBSerByIdError).toBe(null);
  });
});

