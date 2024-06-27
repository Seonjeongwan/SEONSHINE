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
    all: "/all",
    assignList: "/assign-list",
    assignDate: "/assign-date",
  },
  menu: {
    list: "/list",
    createItem: "/item",
    detail: "/item/:id",
    edit: "/item/:id",
    delete: "/item/:id",
    currentDayList: "/current-day-list"
  },
  order: {
    orderItemCurrentDay: "/order-menu-item",
    discardCurrentOrder: "/discard-current-order",
    getOrderPeriod: "/valid-period",
    getOrderListDetail: "/list/detail",
    getOrderListSummary: "/list/summary",
  }
};
