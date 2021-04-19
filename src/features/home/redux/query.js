import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_QUERY_BEGIN,
  HOME_QUERY_SUCCESS,
  HOME_QUERY_FAILURE,
  HOME_QUERY_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';
import axios from 'axios';

export function query(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_QUERY_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${serverUrl}/query`, args, config)
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_QUERY_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_QUERY_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissQueryError() {
  return {
    type: HOME_QUERY_DISMISS_ERROR,
  };
}

export function useQuery() {
  const dispatch = useDispatch();

  const { queryPending, queryError } = useSelector(
    state => ({
      queryPending: state.home.queryPending,
      queryError: state.home.queryError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(query(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissQueryError());
  }, [dispatch]);

  return {
    query: boundAction,
    queryPending,
    queryError,
    dismissQueryError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_QUERY_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        queryPending: true,
        queryError: null,
      };

    case HOME_QUERY_SUCCESS:
      // The request is success
      return {
        ...state,
        queryPending: false,
        queryError: null,
      };

    case HOME_QUERY_FAILURE:
      // The request is failed
      return {
        ...state,
        queryPending: false,
        queryError: action.data.error,
      };

    case HOME_QUERY_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        queryError: null,
      };

    default:
      return state;
  }
}
