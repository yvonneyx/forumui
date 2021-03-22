import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_FIND_ONE_BY_ID_BEGIN,
  HOME_FIND_ONE_BY_ID_SUCCESS,
  HOME_FIND_ONE_BY_ID_FAILURE,
  HOME_FIND_ONE_BY_ID_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';

export function findOneById(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FIND_ONE_BY_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${serverUrl}/User/find`, args, config)
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_FIND_ONE_BY_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_FIND_ONE_BY_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindOneByIdError() {
  return {
    type: HOME_FIND_ONE_BY_ID_DISMISS_ERROR,
  };
}

export function useFindOneById(params) {
  const dispatch = useDispatch();

  const { loggedUserInfo, findOneByIdPending, findOneByIdError } = useSelector(
    state => ({
      findOneByIdPending: state.home.findOneByIdPending,
      findOneByIdError: state.home.findOneByIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findOneById(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindOneByIdError());
  }, [dispatch]);

  return {
    loggedUserInfo,
    findOneById: boundAction,
    findOneByIdPending,
    findOneByIdError,
    dismissFindOneByIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FIND_ONE_BY_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findOneByIdPending: true,
        findOneByIdError: null,
      };

    case HOME_FIND_ONE_BY_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        loggedUserInfo: action.data,
        findOneByIdPending: false,
        findOneByIdError: null,
      };

    case HOME_FIND_ONE_BY_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findOneByIdPending: false,
        findOneByIdError: action.data.error,
      };

    case HOME_FIND_ONE_BY_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findOneByIdError: null,
      };

    default:
      return state;
  }
}
