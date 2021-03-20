import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_SIGN_UP_BEGIN,
  HOME_SIGN_UP_SUCCESS,
  HOME_SIGN_UP_FAILURE,
  HOME_SIGN_UP_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  signUp,
  dismissSignUpError,
  reducer,
} from '../../../../src/features/home/redux/signUp';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/signUp', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when signUp succeeds', () => {
    const store = mockStore({});

    return store.dispatch(signUp())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_SIGN_UP_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_SIGN_UP_SUCCESS);
      });
  });

  it('dispatches failure action when signUp fails', () => {
    const store = mockStore({});

    return store.dispatch(signUp({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_SIGN_UP_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_SIGN_UP_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSignUpError', () => {
    const expectedAction = {
      type: HOME_SIGN_UP_DISMISS_ERROR,
    };
    expect(dismissSignUpError()).toEqual(expectedAction);
  });

  it('handles action type HOME_SIGN_UP_BEGIN correctly', () => {
    const prevState = { signUpPending: false };
    const state = reducer(
      prevState,
      { type: HOME_SIGN_UP_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.signUpPending).toBe(true);
  });

  it('handles action type HOME_SIGN_UP_SUCCESS correctly', () => {
    const prevState = { signUpPending: true };
    const state = reducer(
      prevState,
      { type: HOME_SIGN_UP_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.signUpPending).toBe(false);
  });

  it('handles action type HOME_SIGN_UP_FAILURE correctly', () => {
    const prevState = { signUpPending: true };
    const state = reducer(
      prevState,
      { type: HOME_SIGN_UP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.signUpPending).toBe(false);
    expect(state.signUpError).toEqual(expect.anything());
  });

  it('handles action type HOME_SIGN_UP_DISMISS_ERROR correctly', () => {
    const prevState = { signUpError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_SIGN_UP_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.signUpError).toBe(null);
  });
});

