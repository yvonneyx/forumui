import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_CREATE_A_COMMENT_BEGIN,
  POST_CREATE_A_COMMENT_SUCCESS,
  POST_CREATE_A_COMMENT_FAILURE,
  POST_CREATE_A_COMMENT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function createAComment(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_CREATE_A_COMMENT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Comment/create`,requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_CREATE_A_COMMENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_CREATE_A_COMMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissCreateACommentError() {
  return {
    type: POST_CREATE_A_COMMENT_DISMISS_ERROR,
  };
}

export function useCreateAComment() {
  const dispatch = useDispatch();

  const { createACommentPending, createACommentError } = useSelector(
    state => ({
      createACommentPending: state.post.createACommentPending,
      createACommentError: state.post.createACommentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(createAComment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCreateACommentError());
  }, [dispatch]);

  return {
    createAComment: boundAction,
    createACommentPending,
    createACommentError,
    dismissCreateACommentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_CREATE_A_COMMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        createACommentPending: true,
        createACommentError: null,
      };

    case POST_CREATE_A_COMMENT_SUCCESS:
      // The request is success
      return {
        ...state,
        createACommentPending: false,
        createACommentError: null,
      };

    case POST_CREATE_A_COMMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        createACommentPending: false,
        createACommentError: action.data.error,
      };

    case POST_CREATE_A_COMMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        createACommentError: null,
      };

    default:
      return state;
  }
}
