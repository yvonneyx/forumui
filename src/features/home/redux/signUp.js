import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_SIGN_UP_BEGIN,
  HOME_SIGN_UP_SUCCESS,
  HOME_SIGN_UP_FAILURE,
  HOME_SIGN_UP_DISMISS_ERROR,
} from './constants';
import { serverUrl, config} from '../../../common/globalConfig';

export function signUp(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_SIGN_UP_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/User/add`,
        requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_SIGN_UP_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_SIGN_UP_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissSignUpError() {
  return {
    type: HOME_SIGN_UP_DISMISS_ERROR,
  };
}

export function useSignUp(params) {
  const dispatch = useDispatch();

  const { signUpPending, signUpError } = useSelector(
    state => ({
      signUpPending: state.home.signUpPending,
      signUpError: state.home.signUpError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(signUp(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissSignUpError());
  }, [dispatch]);

  return {
    signUp: boundAction,
    signUpPending,
    signUpError,
    dismissSignUpError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SIGN_UP_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        signUpPending: true,
        signUpError: null,
      };

    case HOME_SIGN_UP_SUCCESS:
      // The request is success
      return {
        ...state,
        signUpPending: false,
        signUpError: null,
      };

    case HOME_SIGN_UP_FAILURE:
      // The request is failed
      return {
        ...state,
        signUpPending: false,
        signUpError: action.data.error,
      };

    case HOME_SIGN_UP_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        signUpError: null,
      };

    default:
      return state;
  }
}
