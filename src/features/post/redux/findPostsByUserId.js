import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_FIND_POSTS_BY_USER_ID_BEGIN,
  POST_FIND_POSTS_BY_USER_ID_SUCCESS,
  POST_FIND_POSTS_BY_USER_ID_FAILURE,
  POST_FIND_POSTS_BY_USER_ID_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';

export function findPostsByUserId(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_FIND_POSTS_BY_USER_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${serverUrl}/Brainstorming/find/creator `, JSON.stringify({ ...args }), config);
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_FIND_POSTS_BY_USER_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_FIND_POSTS_BY_USER_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindPostsByUserIdError() {
  return {
    type: POST_FIND_POSTS_BY_USER_ID_DISMISS_ERROR,
  };
}

export function useFindPostsByUserId() {
  const dispatch = useDispatch();

  const { postsListByUserId, findPostsByUserIdPending, findPostsByUserIdError } = useSelector(
    state => ({
      postsListByUserId: state.post.postsListByUserId,
      findPostsByUserIdPending: state.post.findPostsByUserIdPending,
      findPostsByUserIdError: state.post.findPostsByUserIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findPostsByUserId(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindPostsByUserIdError());
  }, [dispatch]);

  return {
    postsListByUserId,
    findPostsByUserId: boundAction,
    findPostsByUserIdPending,
    findPostsByUserIdError,
    dismissFindPostsByUserIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_FIND_POSTS_BY_USER_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findPostsByUserIdPending: true,
        findPostsByUserIdError: null,
      };

    case POST_FIND_POSTS_BY_USER_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        postsListByUserId: action.data.ext.brainstormings,
        findPostsByUserIdPending: false,
        findPostsByUserIdError: null,
      };

    case POST_FIND_POSTS_BY_USER_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findPostsByUserIdPending: false,
        findPostsByUserIdError: action.data.error,
      };

    case POST_FIND_POSTS_BY_USER_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findPostsByUserIdError: null,
      };

    default:
      return state;
  }
}
