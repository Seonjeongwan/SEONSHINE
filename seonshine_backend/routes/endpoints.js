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
    list: "/list",
    detail: "/:id",
    edit: "/:id",
    restaurantDetail: "/:id",
    changeStatus: "/change-status",
    changeAvatar: "/:id/change-avatar",
    waitingConfirm: "/waiting-confirm",
  },
  restaurant: {
    list: "/list",
    detail: "/:id",
    edit: "/:id",
  },
};
