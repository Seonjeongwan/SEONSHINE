export const endpoints = {
  login: "/login",
  signUp: "/sign-up",
  signUpVerification: "/verify-sign-up",
  branches: {
    getAll: "/branches",
    add: "/branches",
    getById: "/branches/:id",
    delete: "/branches/:id",
  },
  users: {
    list: '/list',
    restaurantList: '/restaurant-list',
    detail: '/:id',
    confirm: '/confirm-signup'
  }
};
