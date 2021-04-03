import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_FIND_POST_BY_ID_BEGIN,
  POST_FIND_POST_BY_ID_SUCCESS,
  POST_FIND_POST_BY_ID_FAILURE,
  POST_FIND_POST_BY_ID_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';

export function findPostById(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_FIND_POST_BY_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${serverUrl}/Brainstorming/find`, JSON.stringify({ ...args }), config)
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_FIND_POST_BY_ID_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_FIND_POST_BY_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindPostByIdError() {
  return {
    type: POST_FIND_POST_BY_ID_DISMISS_ERROR,
  };
}

export function useFindPostById() {
  const dispatch = useDispatch();

  const { postDetail,findPostByIdPending, findPostByIdError } = useSelector(
    state => ({
      postDetail: state.post.postDetail,
      findPostByIdPending: state.post.findPostByIdPending,
      findPostByIdError: state.post.findPostByIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findPostById(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindPostByIdError());
  }, [dispatch]);

  return {
    postDetail,
    findPostById: boundAction,
    findPostByIdPending,
    findPostByIdError,
    dismissFindPostByIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_FIND_POST_BY_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findPostByIdPending: true,
        findPostByIdError: null,
      };

    case POST_FIND_POST_BY_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        postDetail: action.data.data.ext.detail,
        findPostByIdPending: false,
        findPostByIdError: null,
      };

    case POST_FIND_POST_BY_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findPostByIdPending: false,
        findPostByIdError: action.data.error,
      };

    case POST_FIND_POST_BY_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findPostByIdError: null,
      };

    default:
      return state;
  }
}
