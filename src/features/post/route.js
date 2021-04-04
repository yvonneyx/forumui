import { CreatePost, PostView } from './';
// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html


export default {
  path: '',
  childRoutes: [
    { path: 'new-post', component: CreatePost },
    { path: 'post/:id', component: PostView },
  ],
};
