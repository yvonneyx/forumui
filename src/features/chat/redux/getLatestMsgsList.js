import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_GET_LATEST_MSGS_LIST_BEGIN,
  CHAT_GET_LATEST_MSGS_LIST_SUCCESS,
  CHAT_GET_LATEST_MSGS_LIST_FAILURE,
  CHAT_GET_LATEST_MSGS_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getLatestMsgsList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_GET_LATEST_MSGS_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Message/latest`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_GET_LATEST_MSGS_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_GET_LATEST_MSGS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetLatestMsgsListError() {
  return {
    type: CHAT_GET_LATEST_MSGS_LIST_DISMISS_ERROR,
  };
}

export function useGetLatestMsgsList() {
  const dispatch = useDispatch();

  const { getLatestMsgsListPending, getLatestMsgsListError } = useSelector(
    state => ({
      getLatestMsgsListPending: state.chat.getLatestMsgsListPending,
      getLatestMsgsListError: state.chat.getLatestMsgsListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getLatestMsgsList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetLatestMsgsListError());
  }, [dispatch]);

  return {
    getLatestMsgsList: boundAction,
    getLatestMsgsListPending,
    getLatestMsgsListError,
    dismissGetLatestMsgsListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_GET_LATEST_MSGS_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getLatestMsgsListPending: true,
        getLatestMsgsListError: null,
      };

    case CHAT_GET_LATEST_MSGS_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        getLatestMsgsListPending: false,
        getLatestMsgsListError: null,
      };

    case CHAT_GET_LATEST_MSGS_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getLatestMsgsListPending: false,
        getLatestMsgsListError: action.data.error,
      };

    case CHAT_GET_LATEST_MSGS_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getLatestMsgsListError: null,
      };

    default:
      return state;
  }
}
