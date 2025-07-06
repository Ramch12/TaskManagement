import { AxiosResponse } from 'axios';
import { axiosClient } from './apiClient';

export interface SignInPayload {
    [key: string]: any;
}

export interface SignUpPayload {
    [key: string]: any;
}

export interface ForgetPasswordPayload {
    [key: string]: any;
}

export interface ResetPasswordPayload {
    [key: string]: any;
}

export const signInUser = async (payload: SignInPayload): Promise<AxiosResponse> => {
    const response = await axiosClient.post('/api/v1/user/login', payload, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
    return response;
}

export const signUpUser = async (payload: SignUpPayload): Promise<AxiosResponse> => {
    const response = await axiosClient.post('/api/v1/user/signup', payload, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
    return response;
}

export const logOutUser = async (accessToken: string): Promise<AxiosResponse> => {
    const response = await axiosClient.post('/user/logout', {}, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response;
}

export const forgetPassword = async (payload: ForgetPasswordPayload): Promise<AxiosResponse> => {
    const response = await axiosClient.post('/user/forgetPass', payload, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
}

export const resetPassword = async (resetToken: string, payload: ResetPasswordPayload): Promise<AxiosResponse> => {
    const response = await axiosClient.post(`/user/resetPass/${resetToken}`, payload, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
} 