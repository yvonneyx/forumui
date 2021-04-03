import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  POST_VOTE_BEGIN,
  POST_VOTE_SUCCESS,
  POST_VOTE_FAILURE,
  POST_VOTE_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';

export function vote(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: POST_VOTE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${serverUrl}/Brainstorming/answer`, JSON.stringify({ ...args }), config)
      doRequest.then(
        (res) => {
          dispatch({
            type: POST_VOTE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: POST_VOTE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissVoteError() {
  return {
    type: POST_VOTE_DISMISS_ERROR,
  };
}

export function useVote() {
  const dispatch = useDispatch();

  const { votePending, voteError } = useSelector(
    state => ({
      votePending: state.post.votePending,
      voteError: state.post.voteError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(vote(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissVoteError());
  }, [dispatch]);

  return {
    vote: boundAction,
    votePending,
    voteError,
    dismissVoteError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case POST_VOTE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        votePending: true,
        voteError: null,
      };

    case POST_VOTE_SUCCESS:
      // The request is success
      return {
        ...state,
        votePending: false,
        voteError: null,
      };

    case POST_VOTE_FAILURE:
      // The request is failed
      return {
        ...state,
        votePending: false,
        voteError: action.data.error,
      };

    case POST_VOTE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        voteError: null,
      };

    default:
      return state;
  }
}
