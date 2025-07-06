import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import TextField from "../common/TextField";
import SubmitButton from "../common/SubmitButtom";
import CustomLink from "../common/CustomLink";
import { doLogin } from "../../reducers/app";
import { notification } from "../../service";
import { signInUser } from "../../API/user";
import Loader from "../common/Loader";


interface LoginFormData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

interface LoginResponse {
  status:boolean,
  user: User;
  token: string;
}

interface ApiResponse {
  data: LoginResponse;
}

interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

const schema = yup
  .object({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
        "Please enter a valid email"
      )
      .required("Please Enter Email"),
    password: yup
      .string()
      .required("Please enter your password")
      .matches(
        /^.*(?=.{7,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 7 characters, one uppercase, one number and one special case character"
      ),
  })
  .required();

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFormSubmit = (formData: LoginFormData): void => {
    setIsLoading(true);
    signInUser(formData)
      .then(({ data }: ApiResponse) => {
        setIsLoading(false);
        if (data.status) {
          const {
            user,
            token,
          } = data;
          if (token && user) {
            notification({
              title: "Login Success",
              message: "Login Successfully!",
            });
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(doLogin({ token, user }));
            navigate("/");
          }
        }
      })
      .catch(({ response: { data } }: ErrorResponse) => {
        setIsLoading(false);
        if (data) {
          notification({
            type: "danger",
            title: "Invalid",
            message: data?.message,
          });
        } else {
          notification({
            type: "danger",
            title: "Timeout",
            message: "Request Timeout",
          });
        }
      });
  };

  return (
    <div className="login-signup-bg" style={{ paddingTop: "50px" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={4}>
          <div className="form-wrapper">
            <Typography
              variant="h4"
              style={{
                marginBottom: 10,
                textAlign: "center",
                color: "#1346a3",
              }}
            >
              Login Form
            </Typography>
            <form className="login-form" onSubmit={handleSubmit(onFormSubmit)}>
              <TextField
                label="Email"
                placeholder="Enter Your Email"
                customId="email"
                register={register}
                errors={errors?.email?.message}
              />
              <TextField
                label="Password"
                placeholder="Enter Password"
                customId="password"
                register={register}
                type="password"
                errors={errors?.password?.message}
              />
              <CustomLink
                link="/signup"
                label="Create account"
                text="Dont have an account?"
              />
              <div>
                {isLoading ? (
                  <Loader height={52} />
                ) : (
                  <SubmitButton label="Login" />
                )}
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;