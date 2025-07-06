import React, { useState, useEffect } from "react";
import { Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextField from "../../common/TextField";
import SubmitButton from "../../common/SubmitButtom";
import Loader from "../../common/Loader";
import { getProjectById, updateProject } from "../../../API/project";
import { notification } from "../../../service/index";
import { useAuth } from "../../../Hooks/useAuth";


interface UpdateProjectFormData {
  title: string;
  description: string;
  status: "active" | "completed";
}


interface StatusOption {
  id: string;
  name: string;
}

interface UpdateProjectFormProps {
  handleClose: () => void;
  fetchAllProjects: () => void;
  id: string | number | null;
}

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: string;
  __v: number;
}

interface GetProjectApiResponse {
  data: null;
  message: string;
  project?: ProjectData;
}

interface UpdateProjectApiResponse {
  data: null;
  message: string;
  project?: ProjectData;
}

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  status: yup.string().oneOf(["active", "completed"], "Status must be either active or completed").required("Status is required"),
});

const UpdateProjectForm: React.FC<UpdateProjectFormProps> = ({ 
  handleClose, 
  fetchAllProjects, 
  id 
}) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdateProjectFormData>({ resolver: yupResolver(schema) });

  const statusOptions: StatusOption[] = [
    { id: "active", name: "Active" },
    { id: "completed", name: "Completed" },
  ];

  useEffect(() => {
    const fetchProjectData = async (): Promise<void> => {
      if (!id) {
        notification({
          title: "Error",
          type: "danger",
          message: "Project ID is required for editing",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await getProjectById(token, id);
        const { status, data }: { status: number; data: GetProjectApiResponse } = response;
        
        if (status === 200 && data.message === "Success" && data.project) {
          const project = data.project;
          console.log("Setting form values:", {
            title: project.title,
            description: project.description,
            status: project.status
          });
          setValue("title", project.title);
          setValue("description", project.description);
          setValue("status", project.status as "active" | "completed");
          setIsLoading(false);
        }
      } catch (err: any) {
        notification({
          title: "Error",
          type: "danger",
          message: err.message || "Failed to load project data",
        });
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id, token, setValue]);

  const onFormSubmit = async (formData: UpdateProjectFormData): Promise<void> => {
    console.log("Form submitted with data:", formData);
    
    if (!id) {
      notification({
        title: "Error",
        type: "danger",
        message: "Project ID is required for updating",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Sending update request for project ID:", id);
      const response = await updateProject(token, formData, id);
      console.log("Update response:", response);
      const { status, data }: { status: number; data: UpdateProjectApiResponse } = response;
      
      if (status === 200 && data.message === "Success" && data.project) {
        handleClose();
        fetchAllProjects();
        notification({
          title: "Updated",
          type: "success",
          message: "Project successfully updated!",
        });
      } else {
        console.log("Update failed - status:", status, "data:", data);
        notification({
          title: "Error",
          type: "danger",
          message: data?.message || "Update failed",
        });
      }
    } catch (err: any) {
      console.error("Update error:", err);
      notification({
        title: "Error",
        type: "danger",
        message: err.message || "An error occurred while updating the project",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader height={170} />;
  }

  return (
    <div>
      <Typography
        variant="h4"
        style={{ marginBottom: 10, textAlign: "center" }}>
        Update Project
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
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status"
                  value={['active', 'completed'].includes(watch("status")) ? watch("status") : ''}
                  label="Status"
                  {...register("status")}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}>
                  <MenuItem value="" disabled>Select status</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors?.status?.message && (
                <p style={{ color: "red" }}>{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-3">
            <SubmitButton label={isSubmitting ? "Updating..." : "Update Project"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProjectForm; 