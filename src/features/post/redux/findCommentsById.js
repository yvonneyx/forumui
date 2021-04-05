import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_FIND_COMMENTS_BY_ID_BEGIN,
  POST_FIND_COMMENTS_BY_ID_SUCCESS,
  POST_FIND_COMMENTS_BY_ID_FAILURE,
  POST_FIND_COMMENTS_BY_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function findCommentsById(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_FIND_COMMENTS_BY_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${serverUrl}/Comment/find`, JSON.stringify({ ...args }), config);
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_FIND_COMMENTS_BY_ID_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_FIND_COMMENTS_BY_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindCommentsByIdError() {
  return {
    type: POST_FIND_COMMENTS_BY_ID_DISMISS_ERROR,
  };
}

export function useFindCommentsById() {
  const dispatch = useDispatch();

  const { findCommentsByIdPending, findCommentsByIdError } = useSelector(
    state => ({
      findCommentsByIdPending: state.post.findCommentsByIdPending,
      findCommentsByIdError: state.post.findCommentsByIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findCommentsById(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindCommentsByIdError());
  }, [dispatch]);

  return {
    findCommentsById: boundAction,
    findCommentsByIdPending,
    findCommentsByIdError,
    dismissFindCommentsByIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_FIND_COMMENTS_BY_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findCommentsByIdPending: true,
        findCommentsByIdError: null,
      };

    case POST_FIND_COMMENTS_BY_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        findCommentsByIdPending: false,
        findCommentsByIdError: null,
      };

    case POST_FIND_COMMENTS_BY_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findCommentsByIdPending: false,
        findCommentsByIdError: action.data.error,
      };

    case POST_FIND_COMMENTS_BY_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findCommentsByIdError: null,
      };

    default:
      return state;
  }
}
