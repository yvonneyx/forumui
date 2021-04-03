
import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  COMMON_FETCH_CATEGORIES_LIST_BEGIN,
  COMMON_FETCH_CATEGORIES_LIST_SUCCESS,
  COMMON_FETCH_CATEGORIES_LIST_FAILURE,
  COMMON_FETCH_CATEGORIES_LIST_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';

export function fetchCategoriesList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: COMMON_FETCH_CATEGORIES_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/Category/getAll`, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: COMMON_FETCH_CATEGORIES_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: COMMON_FETCH_CATEGORIES_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFetchCategoriesListError() {
  return {
    type: COMMON_FETCH_CATEGORIES_LIST_DISMISS_ERROR,
  };
}

export function useFetchCategoriesList() {
  const dispatch = useDispatch();

  const { categoriesList, fetchCategoriesListPending, fetchCategoriesListError } = useSelector(
    state => ({
      categoriesList: state.common.categoriesList,
      fetchCategoriesListPending: state.common.fetchCategoriesListPending,
      fetchCategoriesListError: state.common.fetchCategoriesListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(fetchCategoriesList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchCategoriesListError());
  }, [dispatch]);

  return {
    categoriesList,
    fetchCategoriesList: boundAction,
    fetchCategoriesListPending,
    fetchCategoriesListError,
    dismissFetchCategoriesListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_FETCH_CATEGORIES_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchCategoriesListPending: true,
        fetchCategoriesListError: null,
      };

    case COMMON_FETCH_CATEGORIES_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        categoriesList: action.data,
        fetchCategoriesListPending: false,
        fetchCategoriesListError: null,
      };

    case COMMON_FETCH_CATEGORIES_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchCategoriesListPending: false,
        fetchCategoriesListError: action.data.error,
      };

    case COMMON_FETCH_CATEGORIES_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchCategoriesListError: null,
      };

    default:
      return state;
  }
}
