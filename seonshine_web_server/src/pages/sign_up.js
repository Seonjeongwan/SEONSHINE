import React from "react";
import "../assets/styles/sign_up.css";
import { Form, Input, Button, message, Select, InputNumber, Row } from "antd";
import axios from "axios";

const { Option } = Select;

const Sign_Up_Page = () => {
  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username: values.username,
        password: values.password,
        email: values.email,
        name: values.name,
        phone: values.phone,
        department: values.department,
      });
      message.success(response.data.message);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("An error occurred");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="82">+82</Option>
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      name="register"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "50px",
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
        name="confirm"
        label="비밀번호 확인"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="이메일"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "올바른 이메일 주소를 입력해주세요!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="이름"
        name="name"
        rules={[
          {
            required: true,
            message: "이름을 입력해주세요!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="핸드폰 번호"
        name="phone"
        rules={[
          {
            required: true,
            message: "핸드폰 번호를 입력해주세요!",
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>

      <Form.Item
        label="부서"
        name="department"
        rules={[
          {
            required: true,
            message: "부서를 선택해주세요!",
          },
        ]}
      >
        <Select placeholder="부서를 선택해주세요">
          <Option value="HR">HR</Option>
          <Option value="Engineering">Engineering</Option>
          <Option value="Marketing">Marketing</Option>
          <Option value="Sales">Sales</Option>
        </Select>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Sign_Up_Page;
