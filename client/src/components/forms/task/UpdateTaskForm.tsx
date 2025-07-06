import React, { useState, useEffect } from "react";
import { Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextField from "../../common/TextField";
import SubmitButton from "../../common/SubmitButtom";
import Loader from "../../common/Loader";
import { getTaskById, updateTask } from "../../../API/task";
import { fetchProjects } from "../../../API/project";
import { notification } from "../../../service/index";
import { useAuth } from "../../../Hooks/useAuth";


interface UpdateTaskFormData {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string;
  projectId: string;
}

interface StatusOption {
  id: string;
  name: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface UpdateTaskFormProps {
  handleClose: () => void;
  fetchAllTasks: () => void;
  id: string | number | null;
}

interface TaskData {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: string;
  createdBy: string;
  __v: number;
}

interface GetTaskApiResponse {
  data: null;
  message: string;
  task?: TaskData;
}

interface UpdateTaskApiResponse {
  data: null;
  message: string;
  task?: TaskData;
}

interface ProjectsApiResponse {
  data: null;
  message: string;
  projects?: {
    docs: Array<{
      _id: string;
      title: string;
      description: string;
      status: string;
    }>;
    totalDocs: number;
  };
}

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  status: yup.string().oneOf(["todo", "in-progress", "done"], "Status must be todo, in-progress, or done").required("Status is required"),
  dueDate: yup.string().required("Due date is required"),
  projectId: yup.string().required("Project is required"),
});

const UpdateTaskForm: React.FC<UpdateTaskFormProps> = ({ 
  handleClose, 
  fetchAllTasks, 
  id 
}) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdateTaskFormData>({ resolver: yupResolver(schema) });

  const statusOptions: StatusOption[] = [
    { id: "todo", name: "Todo" },
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
  ];

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjectsData = async (): Promise<void> => {
      try {
        const response = await fetchProjects(token);
        const { data }: { data: ProjectsApiResponse } = response;
        
        if (data && data.projects && data.projects.docs) {
          const projectOptions = data.projects.docs.map(project => ({
            id: project._id,
            name: project.title
          }));
          setProjects(projectOptions);
        }
      } catch (err: any) {
        notification({
          title: "Error",
          type: "danger",
          message: "Failed to load projects",
        });
      }
    };

    fetchProjectsData();
  }, [token]);

  useEffect(() => {
    const fetchTaskData = async (): Promise<void> => {
      if (!id) {
        notification({
          title: "Error",
          type: "danger",
          message: "Task ID is required for editing",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await getTaskById(token, id);
        const { status, data }: { status: number; data: GetTaskApiResponse } = response;
        
        if (status === 200 && data.message === "Success" && data.task) {
          const task = data.task;
          console.log("Setting task form values:", {
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
            projectId: task.projectId
          });
          setValue("title", task.title);
          setValue("description", task.description);
          setValue("status", task.status as "todo" | "in-progress" | "done");
          setValue("dueDate", task.dueDate.split('T')[0]); // Convert to YYYY-MM-DD format
          setValue("projectId", task.projectId);
          setIsLoading(false);
        }
      } catch (err: any) {
        notification({
          title: "Error",
          type: "danger",
          message: err.message || "Failed to load task data",
        });
        setIsLoading(false);
      }
    };

    fetchTaskData();
  }, [id, token, setValue]);

  const onFormSubmit = async (formData: UpdateTaskFormData): Promise<void> => {
    console.log("Task form submitted with data:", formData);
    
    if (!id) {
      notification({
        title: "Error",
        type: "danger",
        message: "Task ID is required for updating",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Sending task update request for ID:", id);
      const response = await updateTask(token, formData, id);
      console.log("Task update response:", response);
      const { status, data }: { status: number; data: UpdateTaskApiResponse } = response;
      
      if (status === 200 && data.message === "Success" && data.task) {
        handleClose();
        fetchAllTasks();
        notification({
          title: "Updated",
          type: "success",
          message: "Task successfully updated!",
        });
      } else {
        console.log("Task update failed - status:", status, "data:", data);
        notification({
          title: "Error",
          type: "danger",
          message: data?.message || "Update failed",
        });
      }
    } catch (err: any) {
      console.error("Task update error:", err);
      notification({
        title: "Error",
        type: "danger",
        message: err.message || "An error occurred while updating the task",
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
        Update Task
      </Typography>
      <form className="py-3" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="row">
          <div className="col-md-12 mt-3">
            <TextField
              label="Task Title"
              placeholder="Enter task title"
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
              placeholder="Enter task description"
              customId="description"
              type="textarea"
              register={register}
              errors={errors?.description?.message}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mt-3">
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status"
                  value={watch("status") || ""}
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
          <div className="col-md-6 mt-3">
            <TextField
              label="Due Date"
              placeholder="YYYY-MM-DD"
              customId="dueDate"
              type="date"
              register={register}
              errors={errors?.dueDate?.message}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-3">
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel id="project-select-label">Project</InputLabel>
                <Select
                  labelId="project-select-label"
                  id="projectId"
                  value={watch("projectId") || ""}
                  label="Project"
                  {...register("projectId")}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors?.projectId?.message && (
                <p style={{ color: "red" }}>{errors.projectId.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-3">
            <SubmitButton label={isSubmitting ? "Updating..." : "Update Task"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateTaskForm; 