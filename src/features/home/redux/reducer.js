import initialState from './initialState';
import { reducer as signUpReducer } from './signUp';
import { reducer as fetchUserListReducer } from './fetchUserList';
import { reducer as loginReducer } from './login';

const reducers = [
  signUpReducer,
  fetchUserListReducer,
  loginReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
