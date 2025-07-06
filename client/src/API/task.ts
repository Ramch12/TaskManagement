import { axiosClient } from "./apiClient";

export const fetchTasks = async (accessToken: string, customUrl?: string) => {
  const url = customUrl || `/api/v1/task/getAlltask`;
  const tasks = await axiosClient.get(url, {
    headers: {
      Authorization: `jwt ${accessToken}`,
    },
  });
  return tasks;
};

export const createTask = async (accessToken: string, payload: any) => {
  const response = await axiosClient.post(`/api/v1/task/create`, payload, {
    headers: {
      Authorization: `jwt ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const getTaskById = async (accessToken: string, id: string | number) => {
  const response = await axiosClient.get(`/api/v1/task/get/${id}`, {
    headers: {
      Authorization: `jwt ${accessToken}`,
    },
  });
  return response;
};

export const updateTask = async (accessToken: string, payload: any, id: string | number) => {
  const response = await axiosClient.put(`/api/v1/task/update/${id}`, payload, {
    headers: {
      Authorization: `jwt ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const deleteTask = async (id: string | number, accessToken: string) => {
  const res = await axiosClient.delete(`/api/v1/task/delete/${id}`, {
    headers: { Authorization: `jwt ${accessToken}` }
  });
  return res;
};