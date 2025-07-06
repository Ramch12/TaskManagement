import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Loader from "../common/Loader";

import TextField from "../common/TextField";
import SubmitButton from "../common/SubmitButtom";
import { notification } from "../../service";
import CustomLink from "../common/CustomLink";
import { signUpUser } from "../../API/user";
import { doLogin } from "../../reducers/app";
import { RootState } from "../../store";


interface SignUpFormData {
  firstName: string,
  lastName: string,
  mobile: string,
  email: string;
  password: string;
}

interface User {
  _id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
}

interface SignUpResponse {
  status: boolean;
  user: User;
  token: string;
}

interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}

interface SignUpProps {
  handleClose?: () => void;
}

const schema = yup
  .object({
    firstName:yup.string().required(),
    lastName:yup.string().required(),
    mobile:yup.string().required(),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
        "Please enter a valid email"
      )
      .required("Please Enter email"),
    password: yup
      .string()
      .required("Please enter your password")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      )
  })
  .required();

const SignUp: React.FC<SignUpProps> = ({ handleClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
  });
  const { user } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  const onFormSubmit = (v: SignUpFormData): void => {
    setIsLoading(true);
    const formData = { ...v };
    delete (formData as any).confirmPassword;
    
    signUpUser(formData)
      .then(({ data }: { data: SignUpResponse }) => {
        if (data?.status) {
          setIsLoading(false);
          const {
            user,
            token,
          } = data;
          if (token && user) {
            notification({
              title: "SignUp Success",
              message: "SignUp Successfully!",
            });
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(doLogin({ token, user }));
            navigate("/");
          }
        }
      })
      .catch((error: ApiError) => {
        setIsLoading(false);
        notification({
          type: "danger",
          message: error?.response?.data?.message || "An error occurred",
          title: "Error!",
        });
      });
  };

  return (
    <div className="login-signup-bg">
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={4}>
          <div className="form-wrapper">
            <Typography
              variant="h4"
              style={{
                marginBottom: 10,
                textAlign: "center",
                color: "#1346a3",
              }}>
              Register
            </Typography>
            <form className="signup-form" onSubmit={handleSubmit(onFormSubmit)}>
            <TextField
                label="FirstName"
                placeholder="Enter your firstName"
                customId="firstName"
                type="text"
                register={register}
                errors={errors?.email?.message}
              />
              <TextField
                label="LastName"
                placeholder="Enter your lastName"
                customId="lastName"
                type="text"
                register={register}
                errors={errors?.email?.message}
              />
              <TextField
                label="mobile"
                placeholder="Enter your mobileNo"
                customId="mobile"
                type="text"
                register={register}
                errors={errors?.email?.message}
              />
              <TextField
                label="Email"
                placeholder="Enter your email"
                customId="email"
                type="text"
                register={register}
                errors={errors?.email?.message}
              />
              <TextField
                label="Password"
                placeholder="Enter Password"
                customId="password"
                type="password"
                register={register}
                errors={errors?.password?.message}
              />
              <CustomLink
                link={"/login"}
                text="Already have an Account?"
                label={"Login"}
              />
              <div>
                {isLoading ? (
                  <Loader height="52px" />
                ) : (
                  <SubmitButton label={"Submit"} />
                )}
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignUp;