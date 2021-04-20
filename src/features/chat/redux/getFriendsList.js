import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_GET_FRIENDS_LIST_BEGIN,
  CHAT_GET_FRIENDS_LIST_SUCCESS,
  CHAT_GET_FRIENDS_LIST_FAILURE,
  CHAT_GET_FRIENDS_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function getFriendsList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_GET_FRIENDS_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/friend/find`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_GET_FRIENDS_LIST_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_GET_FRIENDS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetFriendsListError() {
  return {
    type: CHAT_GET_FRIENDS_LIST_DISMISS_ERROR,
  };
}

export function useGetFriendsList() {
  const dispatch = useDispatch();

  const { friendsList, getFriendsListPending, getFriendsListError } = useSelector(
    state => ({
      friendsList: state.chat.friendsList,
      getFriendsListPending: state.chat.getFriendsListPending,
      getFriendsListError: state.chat.getFriendsListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getFriendsList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetFriendsListError());
  }, [dispatch]);

  return {
    friendsList,
    getFriendsList: boundAction,
    getFriendsListPending,
    getFriendsListError,
    dismissGetFriendsListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_GET_FRIENDS_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getFriendsListPending: true,
        getFriendsListError: null,
      };

    case CHAT_GET_FRIENDS_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        friendsList: action.data.data,
        getFriendsListPending: false,
        getFriendsListError: null,
      };

    case CHAT_GET_FRIENDS_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getFriendsListPending: false,
        getFriendsListError: action.data.error,
      };

    case CHAT_GET_FRIENDS_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getFriendsListError: null,
      };

    default:
      return state;
  }
}
