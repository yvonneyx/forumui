import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_VERIFY_FRIENDS_RELATION_BEGIN,
  CHAT_VERIFY_FRIENDS_RELATION_SUCCESS,
  CHAT_VERIFY_FRIENDS_RELATION_FAILURE,
  CHAT_VERIFY_FRIENDS_RELATION_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function verifyFriendsRelation(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_VERIFY_FRIENDS_RELATION_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/friend/exist`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_VERIFY_FRIENDS_RELATION_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_VERIFY_FRIENDS_RELATION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissVerifyFriendsRelationError() {
  return {
    type: CHAT_VERIFY_FRIENDS_RELATION_DISMISS_ERROR,
  };
}

export function useVerifyFriendsRelation() {
  const dispatch = useDispatch();

  const { friendsRelation, verifyFriendsRelationPending, verifyFriendsRelationError } = useSelector(
    state => ({
      friendsRelation: state.chat.friendsRelation,
      verifyFriendsRelationPending: state.chat.verifyFriendsRelationPending,
      verifyFriendsRelationError: state.chat.verifyFriendsRelationError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(verifyFriendsRelation(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissVerifyFriendsRelationError());
  }, [dispatch]);

  return {
    friendsRelation,
    verifyFriendsRelation: boundAction,
    verifyFriendsRelationPending,
    verifyFriendsRelationError,
    dismissVerifyFriendsRelationError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_VERIFY_FRIENDS_RELATION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        verifyFriendsRelationPending: true,
        verifyFriendsRelationError: null,
      };

    case CHAT_VERIFY_FRIENDS_RELATION_SUCCESS:
      // The request is success
      return {
        ...state,
        friendsRelation: action.data.msg,
        verifyFriendsRelationPending: false,
        verifyFriendsRelationError: null,
      };

    case CHAT_VERIFY_FRIENDS_RELATION_FAILURE:
      // The request is failed
      return {
        ...state,
        verifyFriendsRelationPending: false,
        verifyFriendsRelationError: action.data.error,
      };

    case CHAT_VERIFY_FRIENDS_RELATION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        verifyFriendsRelationError: null,
      };

    default:
      return state;
  }
}
