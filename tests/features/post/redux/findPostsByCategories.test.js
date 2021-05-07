import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  POST_FIND_POSTS_BY_CATEGORIES_BEGIN,
  POST_FIND_POSTS_BY_CATEGORIES_SUCCESS,
  POST_FIND_POSTS_BY_CATEGORIES_FAILURE,
  POST_FIND_POSTS_BY_CATEGORIES_DISMISS_ERROR,
} from '../../../../src/features/post/redux/constants';

import {
  findPostsByCategories,
  dismissFindPostsByCategoriesError,
  reducer,
} from '../../../../src/features/post/redux/findPostsByCategories';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('post/redux/findPostsByCategories', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findPostsByCategories succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findPostsByCategories())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_POSTS_BY_CATEGORIES_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_POSTS_BY_CATEGORIES_SUCCESS);
      });
  });

  it('dispatches failure action when findPostsByCategories fails', () => {
    const store = mockStore({});

    return store.dispatch(findPostsByCategories({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', POST_FIND_POSTS_BY_CATEGORIES_BEGIN);
        expect(actions[1]).toHaveProperty('type', POST_FIND_POSTS_BY_CATEGORIES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindPostsByCategoriesError', () => {
    const expectedAction = {
      type: POST_FIND_POSTS_BY_CATEGORIES_DISMISS_ERROR,
    };
    expect(dismissFindPostsByCategoriesError()).toEqual(expectedAction);
  });

  it('handles action type POST_FIND_POSTS_BY_CATEGORIES_BEGIN correctly', () => {
    const prevState = { findPostsByCategoriesPending: false };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_CATEGORIES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByCategoriesPending).toBe(true);
  });

  it('handles action type POST_FIND_POSTS_BY_CATEGORIES_SUCCESS correctly', () => {
    const prevState = { findPostsByCategoriesPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_CATEGORIES_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByCategoriesPending).toBe(false);
  });

  it('handles action type POST_FIND_POSTS_BY_CATEGORIES_FAILURE correctly', () => {
    const prevState = { findPostsByCategoriesPending: true };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_CATEGORIES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByCategoriesPending).toBe(false);
    expect(state.findPostsByCategoriesError).toEqual(expect.anything());
  });

  it('handles action type POST_FIND_POSTS_BY_CATEGORIES_DISMISS_ERROR correctly', () => {
    const prevState = { findPostsByCategoriesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: POST_FIND_POSTS_BY_CATEGORIES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPostsByCategoriesError).toBe(null);
  });
});

