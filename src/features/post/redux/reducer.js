// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as createPostReducer } from './createPost';
import { reducer as findPostByIdReducer } from './findPostById';
import { reducer as voteReducer } from './vote';
import { reducer as findPostsByCategoryReducer } from './findPostsByCategory';
import { reducer as findPostsByUserIdReducer } from './findPostsByUserId';
import { reducer as createACommentReducer } from './createAComment';
import { reducer as findCommentsByIdReducer } from './findCommentsById';
import { reducer as likeCommentReducer } from './likeComment';
import { reducer as findPostsByCategoriesReducer } from './findPostsByCategories';
import { reducer as findHotPostsReducer } from './findHotPosts';

const reducers = [
  createPostReducer,
  findPostByIdReducer,
  voteReducer,
  findPostsByCategoryReducer,
  findPostsByUserIdReducer,
  createACommentReducer,
  findCommentsByIdReducer,
  likeCommentReducer,
  findPostsByCategoriesReducer,
  findHotPostsReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
