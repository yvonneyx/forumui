import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_FIND_HOT_POSTS_BEGIN,
  POST_FIND_HOT_POSTS_SUCCESS,
  POST_FIND_HOT_POSTS_FAILURE,
  POST_FIND_HOT_POSTS_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';
import axios from 'axios';

export function findHotPosts(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_FIND_HOT_POSTS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
       const doRequest = axios.post(`${serverUrl}/Brainstorming/find/hot`, args, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_FIND_HOT_POSTS_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_FIND_HOT_POSTS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindHotPostsError() {
  return {
    type: POST_FIND_HOT_POSTS_DISMISS_ERROR,
  };
}

export function useFindHotPosts() {
  const dispatch = useDispatch();

  const { hotPosts, findHotPostsPending, findHotPostsError } = useSelector(
    state => ({
      hotPosts: state.post.hotPosts,
      findHotPostsPending: state.post.findHotPostsPending,
      findHotPostsError: state.post.findHotPostsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findHotPosts(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindHotPostsError());
  }, [dispatch]);

  return {
    hotPosts,
    findHotPosts: boundAction,
    findHotPostsPending,
    findHotPostsError,
    dismissFindHotPostsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_FIND_HOT_POSTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findHotPostsPending: true,
        findHotPostsError: null,
      };

    case POST_FIND_HOT_POSTS_SUCCESS:
      // The request is success
      return {
        ...state,
        hotPosts: action.data.data.ext.brainstormings,
        findHotPostsPending: false,
        findHotPostsError: null,
      };

    case POST_FIND_HOT_POSTS_FAILURE:
      // The request is failed
      return {
        ...state,
        findHotPostsPending: false,
        findHotPostsError: action.data.error,
      };

    case POST_FIND_HOT_POSTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findHotPostsError: null,
      };

    default:
      return state;
  }
}
