import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_FIND_B_SER_BY_ID_BEGIN,
  HOME_FIND_B_SER_BY_ID_SUCCESS,
  HOME_FIND_B_SER_BY_ID_FAILURE,
  HOME_FIND_B_SER_BY_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function findBSerById(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FIND_B_SER_BY_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
     const doRequest = axios.post(`${serverUrl}/User/find`, args, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_FIND_B_SER_BY_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_FIND_B_SER_BY_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindBSerByIdError() {
  return {
    type: HOME_FIND_B_SER_BY_ID_DISMISS_ERROR,
  };
}

export function useFindBSerById() {
  const dispatch = useDispatch();

  const { findBSerByIdPending, findBSerByIdError } = useSelector(
    state => ({
      findBSerByIdPending: state.home.findBSerByIdPending,
      findBSerByIdError: state.home.findBSerByIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findBSerById(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindBSerByIdError());
  }, [dispatch]);

  return {
    findBSerById: boundAction,
    findBSerByIdPending,
    findBSerByIdError,
    dismissFindBSerByIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FIND_B_SER_BY_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findBSerByIdPending: true,
        findBSerByIdError: null,
      };

    case HOME_FIND_B_SER_BY_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        findBSerByIdPending: false,
        findBSerByIdError: null,
      };

    case HOME_FIND_B_SER_BY_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findBSerByIdPending: false,
        findBSerByIdError: action.data.error,
      };

    case HOME_FIND_B_SER_BY_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findBSerByIdError: null,
      };

    default:
      return state;
  }
}
