export const paths = {
  index: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  signUp: '/sign-up',
  pageNotFound: '/404',
  admin: '/admin',
  dashboard: '/dashboard',
  user: { index: 'user', detail: ':id', register: 'register', edit: ':id/edit' },
  restaurant: { index: 'restaurant', menu: 'menu' },
  restaurantAssignment: { index: 'restaurant-assign' },
  menu: { index: 'menu' },
  order: { index: 'order', menu: 'order-menu' },
};
