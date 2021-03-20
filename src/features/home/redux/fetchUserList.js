import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_FETCH_USER_LIST_BEGIN,
  HOME_FETCH_USER_LIST_SUCCESS,
  HOME_FETCH_USER_LIST_FAILURE,
  HOME_FETCH_USER_LIST_DISMISS_ERROR,
} from './constants';
import { globalConfig, config } from '../../../common/globalConfig';

export function fetchUserList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FETCH_USER_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${globalConfig.svcId}/User/findAll`, config);

      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_FETCH_USER_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_FETCH_USER_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchUserListError() {
  return {
    type: HOME_FETCH_USER_LIST_DISMISS_ERROR,
  };
}

export function useFetchUserList(params) {
  const dispatch = useDispatch();

  const { userList, fetchUserListPending, fetchUserListError } = useSelector(
    state => ({
      userList: state.home.userList,
      fetchUserListPending: state.home.fetchUserListPending,
      fetchUserListError: state.home.fetchUserListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchUserList(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchUserListError());
  }, [dispatch]);

  return {
    userList,
    fetchUserList: boundAction,
    fetchUserListPending,
    fetchUserListError,
    dismissFetchUserListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_USER_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchUserListPending: true,
        fetchUserListError: null,
      };

    case HOME_FETCH_USER_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        userList: action.data,
        fetchUserListPending: false,
        fetchUserListError: null,
      };

    case HOME_FETCH_USER_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchUserListPending: false,
        fetchUserListError: action.data.error,
      };

    case HOME_FETCH_USER_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchUserListError: null,
      };

    default:
      return state;
  }
}
