import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_GET_ALL_OFFLINES_BEGIN,
  CHAT_GET_ALL_OFFLINES_SUCCESS,
  CHAT_GET_ALL_OFFLINES_FAILURE,
  CHAT_GET_ALL_OFFLINES_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function getAllOfflines(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_GET_ALL_OFFLINES_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Message/offline`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_GET_ALL_OFFLINES_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_GET_ALL_OFFLINES_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetAllOfflinesError() {
  return {
    type: CHAT_GET_ALL_OFFLINES_DISMISS_ERROR,
  };
}

export function useGetAllOfflines() {
  const dispatch = useDispatch();

  const { getAllOfflinesPending, getAllOfflinesError } = useSelector(
    state => ({
      getAllOfflinesPending: state.chat.getAllOfflinesPending,
      getAllOfflinesError: state.chat.getAllOfflinesError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getAllOfflines(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetAllOfflinesError());
  }, [dispatch]);

  return {
    getAllOfflines: boundAction,
    getAllOfflinesPending,
    getAllOfflinesError,
    dismissGetAllOfflinesError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_GET_ALL_OFFLINES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getAllOfflinesPending: true,
        getAllOfflinesError: null,
      };

    case CHAT_GET_ALL_OFFLINES_SUCCESS:
      // The request is success
      return {
        ...state,
        getAllOfflinesPending: false,
        getAllOfflinesError: null,
      };

    case CHAT_GET_ALL_OFFLINES_FAILURE:
      // The request is failed
      return {
        ...state,
        getAllOfflinesPending: false,
        getAllOfflinesError: action.data.error,
      };

    case CHAT_GET_ALL_OFFLINES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getAllOfflinesError: null,
      };

    default:
      return state;
  }
}
