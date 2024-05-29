import logo from "./logo.svg";
import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useRoutes,
} from "react-router-dom";
import MainPage from "./pages/main";
import LoginPage from "./pages/login";
import Menu_Order_Page from "./pages/menu_order";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Menu_Register_Page from "./pages/menu_register";
import Order_His_Page from "./pages/order_his";
import Order_List_Page from "./pages/order_list";
import Sign_Up_Page from "./pages/sign_up";
import User_Mgt_Page from "./pages/user_mgt";

function App() {
  const routes = useRoutes([
    { path: "/", element: <MainPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/menu_order", element: <Menu_Order_Page /> },
    { path: "/menu_register", element: <Menu_Register_Page /> },
    { path: "/order_his", element: <Order_His_Page /> },
    { path: "/order_list", element: <Order_List_Page /> },
    { path: "/sign_ip", element: <Sign_Up_Page /> },
    { path: "/user_mgt", element: <User_Mgt_Page /> },
  ]);

  return (
    <div>
      <Header />
      <div id="body">{routes}</div>
      <Footer />
    </div>
  );
}

export default App;
