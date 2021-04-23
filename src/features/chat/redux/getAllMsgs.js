import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_GET_ALL_MSGS_BEGIN,
  CHAT_GET_ALL_MSGS_SUCCESS,
  CHAT_GET_ALL_MSGS_FAILURE,
  CHAT_GET_ALL_MSGS_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function getAllMsgs(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_GET_ALL_MSGS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Message/all`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_GET_ALL_MSGS_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_GET_ALL_MSGS_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetAllMsgsError() {
  return {
    type: CHAT_GET_ALL_MSGS_DISMISS_ERROR,
  };
}

export function useGetAllMsgs() {
  const dispatch = useDispatch();

  const { getAllMsgsPending, getAllMsgsError } = useSelector(
    state => ({
      getAllMsgsPending: state.chat.getAllMsgsPending,
      getAllMsgsError: state.chat.getAllMsgsError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getAllMsgs(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetAllMsgsError());
  }, [dispatch]);

  return {
    getAllMsgs: boundAction,
    getAllMsgsPending,
    getAllMsgsError,
    dismissGetAllMsgsError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_GET_ALL_MSGS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getAllMsgsPending: true,
        getAllMsgsError: null,
      };

    case CHAT_GET_ALL_MSGS_SUCCESS:
      // The request is success
      return {
        ...state,
        getAllMsgsPending: false,
        getAllMsgsError: null,
      };

    case CHAT_GET_ALL_MSGS_FAILURE:
      // The request is failed
      return {
        ...state,
        getAllMsgsPending: false,
        getAllMsgsError: action.data.error,
      };

    case CHAT_GET_ALL_MSGS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getAllMsgsError: null,
      };

    default:
      return state;
  }
}
