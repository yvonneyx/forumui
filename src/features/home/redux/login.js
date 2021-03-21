import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_LOGIN_BEGIN,
  HOME_LOGIN_SUCCESS,
  HOME_LOGIN_FAILURE,
  HOME_LOGIN_DISMISS_ERROR,
} from './constants';
import {globalConfig, config} from '../../../common/globalConfig';

export function login(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_LOGIN_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${globalConfig.svcId}/User/login`, requestJSON, config)
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_LOGIN_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_LOGIN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissLoginError() {
  return {
    type: HOME_LOGIN_DISMISS_ERROR,
  };
}

export function useLogin(params) {
  const dispatch = useDispatch();

  const { loggedId, loginPending, loginError } = useSelector(
    state => ({
      loggedId: state.home.loggedId,
      loginPending: state.home.loginPending,
      loginError: state.home.loginError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(login(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissLoginError());
  }, [dispatch]);

  return {
    login: boundAction,
    loggedId,
    loginPending,
    loginError,
    dismissLoginError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_LOGIN_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        loginPending: true,
        loginError: null,
      };

    case HOME_LOGIN_SUCCESS:
      // The request is success
      return {
        ...state,
        loggedId: action.data.success ? action.data.ext.id : '',
        loginPending: false,
        loginError: null,
      };

    case HOME_LOGIN_FAILURE:
      // The request is failed
      return {
        ...state,
        loginPending: false,
        loginError: action.data.error,
      };

    case HOME_LOGIN_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        loginError: null,
      };

    default:
      return state;
  }
}
