import { Accueil, Login, Signup, Profile,CategoriesWidget } from './';

export default {
  path: '',
  childRoutes: [
  { path: 'accueil', component: Accueil, isIndex: true },
  { path: 'login', component: Login, hideHeader: true },
  { path: 'signup', component: Signup },
  { path: 'setting-profile', component: Profile },
  { path: 'CategoriesWidget', component: CategoriesWidget }],
};
