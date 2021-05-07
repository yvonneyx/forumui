import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_FIND_POSTS_BY_CATEGORIES_BEGIN,
  POST_FIND_POSTS_BY_CATEGORIES_SUCCESS,
  POST_FIND_POSTS_BY_CATEGORIES_FAILURE,
  POST_FIND_POSTS_BY_CATEGORIES_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';
import axios from 'axios';
export function findPostsByCategories(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_FIND_POSTS_BY_CATEGORIES_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
       const doRequest = axios.post(`${serverUrl}/Brainstorming/find/categoryS`, JSON.stringify({ ...args }), config);
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_FIND_POSTS_BY_CATEGORIES_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_FIND_POSTS_BY_CATEGORIES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindPostsByCategoriesError() {
  return {
    type: POST_FIND_POSTS_BY_CATEGORIES_DISMISS_ERROR,
  };
}

export function useFindPostsByCategories() {
  const dispatch = useDispatch();

  const { postsByCategories, findPostsByCategoriesPending, findPostsByCategoriesError } = useSelector(
    state => ({
      postsByCategories: state.post.postsByCategories,
      findPostsByCategoriesPending: state.post.findPostsByCategoriesPending,
      findPostsByCategoriesError: state.post.findPostsByCategoriesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findPostsByCategories(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindPostsByCategoriesError());
  }, [dispatch]);

  return {
    postsByCategories,
    findPostsByCategories: boundAction,
    findPostsByCategoriesPending,
    findPostsByCategoriesError,
    dismissFindPostsByCategoriesError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_FIND_POSTS_BY_CATEGORIES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findPostsByCategoriesPending: true,
        findPostsByCategoriesError: null,
      };

    case POST_FIND_POSTS_BY_CATEGORIES_SUCCESS:
      // The request is success
      return {
        ...state,
        postsByCategories: action.data.ext.brainstormings,
        findPostsByCategoriesPending: false,
        findPostsByCategoriesError: null,
      };

    case POST_FIND_POSTS_BY_CATEGORIES_FAILURE:
      // The request is failed
      return {
        ...state,
        findPostsByCategoriesPending: false,
        findPostsByCategoriesError: action.data.error,
      };

    case POST_FIND_POSTS_BY_CATEGORIES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findPostsByCategoriesError: null,
      };

    default:
      return state;
  }
}
