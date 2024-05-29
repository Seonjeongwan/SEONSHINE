import "../assets/styles/login.css";
import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username: values.username,
        password: values.password,
      });
      message.success(response.data.message);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("오류가 발생했습니다");
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    // <div>로그인 페이지 입니다</div>;
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="아이디"
        name="username"
        rules={[
          {
            required: true,
            message: "아이디(행번)을 입력해주세요!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="비밀번호"
        name="password"
        rules={[
          {
            required: true,
            message: "비밀번호를 입력해주세요!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>아이디 저장</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Sign-in
        </Button>

        <Link to="/sign_up">
          <Button type="default">Register</Button>
        </Link>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
