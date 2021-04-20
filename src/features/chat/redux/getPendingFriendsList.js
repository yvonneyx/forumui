import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_GET_PENDING_FRIENDS_LIST_BEGIN,
  CHAT_GET_PENDING_FRIENDS_LIST_SUCCESS,
  CHAT_GET_PENDING_FRIENDS_LIST_FAILURE,
  CHAT_GET_PENDING_FRIENDS_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function getPendingFriendsList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_GET_PENDING_FRIENDS_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/friend/find/wait`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_GET_PENDING_FRIENDS_LIST_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_GET_PENDING_FRIENDS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetPendingFriendsListError() {
  return {
    type: CHAT_GET_PENDING_FRIENDS_LIST_DISMISS_ERROR,
  };
}

export function useGetPendingFriendsList() {
  const dispatch = useDispatch();

  const { pendingFriendsList, getPendingFriendsListPending, getPendingFriendsListError } = useSelector(
    state => ({
      pendingFriendsList: state.chat.pendingFriendsList,
      getPendingFriendsListPending: state.chat.getPendingFriendsListPending,
      getPendingFriendsListError: state.chat.getPendingFriendsListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getPendingFriendsList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetPendingFriendsListError());
  }, [dispatch]);

  return {
    pendingFriendsList,
    getPendingFriendsList: boundAction,
    getPendingFriendsListPending,
    getPendingFriendsListError,
    dismissGetPendingFriendsListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_GET_PENDING_FRIENDS_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getPendingFriendsListPending: true,
        getPendingFriendsListError: null,
      };

    case CHAT_GET_PENDING_FRIENDS_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        pendingFriendsList: action.data.data,
        getPendingFriendsListPending: false,
        getPendingFriendsListError: null,
      };

    case CHAT_GET_PENDING_FRIENDS_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getPendingFriendsListPending: false,
        getPendingFriendsListError: action.data.error,
      };

    case CHAT_GET_PENDING_FRIENDS_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getPendingFriendsListError: null,
      };

    default:
      return state;
  }
}
