import { axiosClient } from "./apiClient";

export const fetchProjects = async (accessToken: string, page: number = 0, limit: number = 10) => {
  const projects = await axiosClient.get(`/api/v1/project/getAllProject?page=${page + 1}&limit=${limit}`, {
    headers: {
      Authorization: `jwt ${accessToken}`,
    },
  });
  return projects;
};

export const createProject = async (accessToken: string, payload: any) => {
  const response = await axiosClient.post(`/api/v1/project/create`, payload, {
    headers: {
      Authorization: `jwt ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const getProjectById = async (accessToken: string, id: string | number) => {
  const response = await axiosClient.get(`/api/v1/project/getProject/${id}`, {
    headers: {
      Authorization: `jwt ${accessToken}`,
    },
  });
  return response;
};

export const getProjectWithTasks = async (accessToken: string, id: string | number) => {
  const response = await axiosClient.get(`/api/v1/project/getProjectWithTask/${id}`, {
    headers: {
      Authorization: `jwt ${accessToken}`,
    },
  });
  return response;
};

export const updateProject = async (accessToken: string, payload: any, id: string | number) => {
  const response = await axiosClient.put(`/api/v1/project/update/${id}`, payload, {
    headers: {
      Authorization: `jwt ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const deleteProject = async (id: string | number, accessToken: string) => {
    const res = await axiosClient.delete(`/api/v1/project/delete/${id}`, {
        headers: { Authorization: `jwt ${accessToken}` }
    });
    return res;
}; 