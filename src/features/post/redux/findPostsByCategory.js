import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_FIND_POSTS_BY_CATEGORY_BEGIN,
  POST_FIND_POSTS_BY_CATEGORY_SUCCESS,
  POST_FIND_POSTS_BY_CATEGORY_FAILURE,
  POST_FIND_POSTS_BY_CATEGORY_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';

export function findPostsByCategory(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_FIND_POSTS_BY_CATEGORY_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${serverUrl}/Brainstorming/find/category`, JSON.stringify({ ...args }), config);
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_FIND_POSTS_BY_CATEGORY_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_FIND_POSTS_BY_CATEGORY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindPostsByCategoryError() {
  return {
    type: POST_FIND_POSTS_BY_CATEGORY_DISMISS_ERROR,
  };
}

export function useFindPostsByCategory(params) {
  const dispatch = useDispatch();

  const { postsListByCategory, findPostsByCategoryPending, findPostsByCategoryError } = useSelector(
    state => ({
      postsListByCategory: state.post.postsListByCategory,
      findPostsByCategoryPending: state.post.findPostsByCategoryPending,
      findPostsByCategoryError: state.post.findPostsByCategoryError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findPostsByCategory(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindPostsByCategoryError());
  }, [dispatch]);

  return {
    postsListByCategory,
    findPostsByCategory: boundAction,
    findPostsByCategoryPending,
    findPostsByCategoryError,
    dismissFindPostsByCategoryError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_FIND_POSTS_BY_CATEGORY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findPostsByCategoryPending: true,
        findPostsByCategoryError: null,
      };

    case POST_FIND_POSTS_BY_CATEGORY_SUCCESS:
      // The request is success
      return {
        ...state,
        postsListByCategory: action.data.ext.brainstormings,
        findPostsByCategoryPending: false,
        findPostsByCategoryError: null,
      };

    case POST_FIND_POSTS_BY_CATEGORY_FAILURE:
      // The request is failed
      return {
        ...state,
        findPostsByCategoryPending: false,
        findPostsByCategoryError: action.data.error,
      };

    case POST_FIND_POSTS_BY_CATEGORY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findPostsByCategoryError: null,
      };

    default:
      return state;
  }
}
