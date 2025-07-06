import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextField from "../../common/TextField";
import SubmitButton from "../../common/SubmitButtom";
import SelectField from "../../common/SelectField";
import { createTask } from "../../../API/task";
import { fetchProjects } from "../../../API/project";
import { notification } from "../../../service/index";
import { useAuth } from "../../../Hooks/useAuth";


interface CreateTaskFormData {
  title: string;
  description: string;
  status: string;
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


interface CreateTaskFormProps {
  handleClose: () => void;
  fetchAllTasks: () => void;
}


interface ApiResponse {
  data: null;
  message: string;
  task?: {
    _id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    projectId: string;
    createdBy: string;
    __v: number;
  };
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
  status: yup.string().required("Status is required"),
  dueDate: yup.string().required("Due date is required"),
  projectId: yup.string().required("Project is required"),
});

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ 
  handleClose, 
  fetchAllTasks 
}) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<CreateTaskFormData>({ resolver: yupResolver(schema) });

  const statusOptions: StatusOption[] = [
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
    { id: "pending", name: "Pending" },
  ];

 
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
    setValue("projectId", selectedProject);
    if (selectedProject) {
      clearErrors(["projectId"]);
    }
  }, [selectedProject, setValue, clearErrors]);

  const onFormSubmit = async (formData: CreateTaskFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await createTask(token, formData);
      const { status, data }: { status: number; data: ApiResponse } = response;
      
      if (status === 201 && data.message === "Success" && data.task) {
        handleClose();
        fetchAllTasks();
        notification({
          title: "Created",
          type: "success",
          message: "Task successfully created!",
        });
      }
    } catch (err: any) {
      notification({
        title: "Error",
        type: "danger",
        message: err.message || "An error occurred while creating the task",
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
        Create Task
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
            <SelectField
              componentId="projectId"
              register={register}
              label="Project"
              errors={errors?.projectId?.message}
              records={projects}
              initValue={""}
              options={[]}
              name="projectId"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-3">
            <SubmitButton label="Create Task" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm; 