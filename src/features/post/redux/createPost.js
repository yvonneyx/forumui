import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_CREATE_POST_BEGIN,
  POST_CREATE_POST_SUCCESS,
  POST_CREATE_POST_FAILURE,
  POST_CREATE_POST_DISMISS_ERROR,
} from './constants';
import { serverUrl, config} from '../../../common/globalConfig';

export function createPost(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_CREATE_POST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Brainstorming/create`,requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_CREATE_POST_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_CREATE_POST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCreatePostError() {
  return {
    type: POST_CREATE_POST_DISMISS_ERROR,
  };
}

export function useCreatePost() {
  const dispatch = useDispatch();

  const { createPostPending, createPostError } = useSelector(
    state => ({
      createPostPending: state.post.createPostPending,
      createPostError: state.post.createPostError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(createPost(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCreatePostError());
  }, [dispatch]);

  return {
    createPost: boundAction,
    createPostPending,
    createPostError,
    dismissCreatePostError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_CREATE_POST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        createPostPending: true,
        createPostError: null,
      };

    case POST_CREATE_POST_SUCCESS:
      // The request is success
      return {
        ...state,
        createPostPending: false,
        createPostError: null,
      };

    case POST_CREATE_POST_FAILURE:
      // The request is failed
      return {
        ...state,
        createPostPending: false,
        createPostError: action.data.error,
      };

    case POST_CREATE_POST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        createPostError: null,
      };

    default:
      return state;
  }
}
