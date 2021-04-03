import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  COMMON_FETCH_CATEGORIES_LIST_BEGIN,
  COMMON_FETCH_CATEGORIES_LIST_SUCCESS,
  COMMON_FETCH_CATEGORIES_LIST_FAILURE,
  COMMON_FETCH_CATEGORIES_LIST_DISMISS_ERROR,
} from '../../../../src/features/common/redux/constants';

import {
  fetchCategoriesList,
  dismissFetchCategoriesListError,
  reducer,
} from '../../../../src/features/common/redux/fetchCategoriesList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('common/redux/fetchCategoriesList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchCategoriesList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchCategoriesList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', COMMON_FETCH_CATEGORIES_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', COMMON_FETCH_CATEGORIES_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when fetchCategoriesList fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchCategoriesList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', COMMON_FETCH_CATEGORIES_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', COMMON_FETCH_CATEGORIES_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchCategoriesListError', () => {
    const expectedAction = {
      type: COMMON_FETCH_CATEGORIES_LIST_DISMISS_ERROR,
    };
    expect(dismissFetchCategoriesListError()).toEqual(expectedAction);
  });

  it('handles action type COMMON_FETCH_CATEGORIES_LIST_BEGIN correctly', () => {
    const prevState = { fetchCategoriesListPending: false };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_CATEGORIES_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCategoriesListPending).toBe(true);
  });

  it('handles action type COMMON_FETCH_CATEGORIES_LIST_SUCCESS correctly', () => {
    const prevState = { fetchCategoriesListPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_CATEGORIES_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCategoriesListPending).toBe(false);
  });

  it('handles action type COMMON_FETCH_CATEGORIES_LIST_FAILURE correctly', () => {
    const prevState = { fetchCategoriesListPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_CATEGORIES_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCategoriesListPending).toBe(false);
    expect(state.fetchCategoriesListError).toEqual(expect.anything());
  });

  it('handles action type COMMON_FETCH_CATEGORIES_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCategoriesListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: COMMON_FETCH_CATEGORIES_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchCategoriesListError).toBe(null);
  });
});

