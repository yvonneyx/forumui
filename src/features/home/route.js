import { WelcomePage, Accueil, Login, Signup } from './';

export default {
  path: '',
  childRoutes: [{ path: 'welcome-page', component: WelcomePage, isIndex: true }, 
  { path: 'accueil', component: Accueil }, 
  { path: 'login', component: Login, hideHeader: true },
                                                         { path: 'signup', component: Signup }],
};
