import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_LIKE_COMMENT_BEGIN,
  POST_LIKE_COMMENT_SUCCESS,
  POST_LIKE_COMMENT_FAILURE,
  POST_LIKE_COMMENT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function likeComment(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_LIKE_COMMENT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Comment/like`,requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_LIKE_COMMENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_LIKE_COMMENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissLikeCommentError() {
  return {
    type: POST_LIKE_COMMENT_DISMISS_ERROR,
  };
}

export function useLikeComment() {
  const dispatch = useDispatch();

  const { likeCommentPending, likeCommentError } = useSelector(
    state => ({
      likeCommentPending: state.post.likeCommentPending,
      likeCommentError: state.post.likeCommentError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(likeComment(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissLikeCommentError());
  }, [dispatch]);

  return {
    likeComment: boundAction,
    likeCommentPending,
    likeCommentError,
    dismissLikeCommentError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_LIKE_COMMENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        likeCommentPending: true,
        likeCommentError: null,
      };

    case POST_LIKE_COMMENT_SUCCESS:
      // The request is success
      return {
        ...state,
        likeCommentPending: false,
        likeCommentError: null,
      };

    case POST_LIKE_COMMENT_FAILURE:
      // The request is failed
      return {
        ...state,
        likeCommentPending: false,
        likeCommentError: action.data.error,
      };

    case POST_LIKE_COMMENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        likeCommentError: null,
      };

    default:
      return state;
  }
}
