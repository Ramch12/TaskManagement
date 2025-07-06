import React, { useState } from "react";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextField from "../../common/TextField";
import SubmitButton from "../../common/SubmitButtom";
import SelectField from "../../common/SelectField";
import { createProject } from "../../../API/project";
import { notification } from "../../../service/index";
import { useAuth } from "../../../Hooks/useAuth";

interface CreateProjectFormData {
  title: string;
  description: string;
  status: string;
}


interface StatusOption {
  id: string;
  name: string;
}


interface CreateProjectFormProps {
  handleClose: () => void;
  fetchAllProjects: () => void;
}


interface ApiResponse {
  data: null;
  message: string;
  project?: {
    title: string;
    description: string;
    status: string;
    createdBy: string;
    _id: string;
    __v: number;
  };
}

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  status: yup.string().required("Status is required"),
});

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ 
  handleClose, 
  fetchAllProjects 
}) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormData>({ resolver: yupResolver(schema) });

  const statusOptions: StatusOption[] = [
    { id: "active", name: "Active" },
    { id: "completed", name: "Completed" },
  ];

  const onFormSubmit = async (formData: CreateProjectFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await createProject(token, formData);
      const { status, data }: { status: number; data: ApiResponse } = response;
      
      if (status === 201 && data.message === "Success" && data.project) {
        handleClose();
        fetchAllProjects();
        notification({
          title: "Created",
          type: "success",
          message: "Project successfully created!",
        });
      }
    } catch (err: any) {
      notification({
        title: "Error",
        type: "danger",
        message: err.message || "An error occurred while creating the project",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Typography
        variant="h4"
        style={{ marginBottom: 10, textAlign: "center" }}>
        Create Project
      </Typography>
      <form className="py-3" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="row">
          <div className="col-md-12 mt-3">
            <TextField
              label="Project Title"
              placeholder="Enter project title"
              customId="title"
              type="text"
              register={register}
              errors={errors?.title?.message}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-3">
            <TextField
              label="Description"
              placeholder="Enter project description"
              customId="description"
              type="textarea"
              register={register}
              errors={errors?.description?.message}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-3">
            <SelectField
              componentId="status"
              register={register}
              label="Status"
              errors={errors?.status?.message}
              records={statusOptions}
              initValue={""}
              options={[]}
              name="status"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-3">
            <SubmitButton label="Create Project" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm; 