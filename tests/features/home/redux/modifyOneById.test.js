import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_MODIFY_ONE_BY_ID_BEGIN,
  HOME_MODIFY_ONE_BY_ID_SUCCESS,
  HOME_MODIFY_ONE_BY_ID_FAILURE,
  HOME_MODIFY_ONE_BY_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  modifyOneById,
  dismissModifyOneByIdError,
  reducer,
} from '../../../../src/features/home/redux/modifyOneById';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/modifyOneById', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when modifyOneById succeeds', () => {
    const store = mockStore({});

    return store.dispatch(modifyOneById())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_MODIFY_ONE_BY_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_MODIFY_ONE_BY_ID_SUCCESS);
      });
  });

  it('dispatches failure action when modifyOneById fails', () => {
    const store = mockStore({});

    return store.dispatch(modifyOneById({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_MODIFY_ONE_BY_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_MODIFY_ONE_BY_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissModifyOneByIdError', () => {
    const expectedAction = {
      type: HOME_MODIFY_ONE_BY_ID_DISMISS_ERROR,
    };
    expect(dismissModifyOneByIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_MODIFY_ONE_BY_ID_BEGIN correctly', () => {
    const prevState = { modifyOneByIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_MODIFY_ONE_BY_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.modifyOneByIdPending).toBe(true);
  });

  it('handles action type HOME_MODIFY_ONE_BY_ID_SUCCESS correctly', () => {
    const prevState = { modifyOneByIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_MODIFY_ONE_BY_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.modifyOneByIdPending).toBe(false);
  });

  it('handles action type HOME_MODIFY_ONE_BY_ID_FAILURE correctly', () => {
    const prevState = { modifyOneByIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_MODIFY_ONE_BY_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.modifyOneByIdPending).toBe(false);
    expect(state.modifyOneByIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_MODIFY_ONE_BY_ID_DISMISS_ERROR correctly', () => {
    const prevState = { modifyOneByIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_MODIFY_ONE_BY_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.modifyOneByIdError).toBe(null);
  });
});

