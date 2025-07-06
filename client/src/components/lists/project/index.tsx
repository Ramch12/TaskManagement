import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import List from "../List";
import TableActionCell from "../TableActionCell";
import { fetchProjects } from "../../../API/project";
import { useAuth } from "../../../Hooks/useAuth";
import { notification } from "../../../service/index";
import Loader from "../../common/Loader";
import NoRecordFound from "../../common/NoRecordFound";
import AddButton from "../../common/AddButton";
import PaginationComponent from "../../common/ReactPaginate";
import AbstractModal from "../../AbstractModal";
import CreateProjectForm from "../../forms/project/CreateProjectForm";
import { useDispatch } from "react-redux";
import { openModal } from "../../../reducers/modal";
import { deleteProject } from "../../../API/project";
import UpdateProjectForm from "../../forms/project/UpdateProjectForm";
import { deletePopup } from "../../../service/index";

// Type definitions
interface Project {
  _id: string | number;
  title: string;
  name?: string;
  description?: string | number;
  status?: string
}

interface ProjectRow extends Project {
  action: React.ReactElement;
}

interface Column {
  name: string;
  label: string;
  width?: number;
  align: "left" | "center" | "right";
}

interface PageChangeEvent {
  selected: number;
}

interface AuthHook {
  token: string;
}

const ProjectList: React.FC = () => {
  const [records, setRecords] = useState<Project[]>([]);
  const [Id, setId] = useState<string | number | null>(null);
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const { token } = useAuth() as AuthHook;
  const navigate = useNavigate();
  const { state, search } = useLocation();

  const fetchAllProjects = (): void => {
    setIsLoading(true);
    fetchProjects(token, page)
      .then(({ data }: { data: any }) => {
        if (data && data.projects) {
          setRecords(data.projects.docs || []);
          setCount(data.projects.totalDocs || 0);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        notification({ title: "Error", message: err.message, type: "danger" });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAllProjects();
  }, [page]);

  useEffect(() => {
    if (search === "?tab=add_new_project") { // Fixed naming
      setShow(!show);
      dispatch(openModal({ modalType: "create" }));
    }
  }, [search]);

  const handlePageChange = ({ selected }: PageChangeEvent): void => {
    setPage(selected);
  };

  const handleClose = (): void => {
    setShow(!show);
    dispatch(openModal({ modalType: "" }));
    if (search === "?tab=add_new_project") { // Fixed naming
      navigate("/project-list"); // Fixed navigation
    }
  };

  const handleEdit = (id: string | number): void => {
    setShow(!show);
    dispatch(openModal({ modalType: "edit" }));
    setId(id);
  };

  const handleDestroy = (id: string | number): void => {
    deletePopup({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this project?", // Fixed message
      onConfirm: () => {
        console.log("Deleting project with ID:", id);
        deleteProject(id, token)
          .then(({ status, data }: { status: number; data?: any }) => {
            if (status === 200) {
              notification({
                title: "Deleted",
                type: "success",
                message: "Project successfully deleted!",
              });
              if (count && count % 10 === 1 && count !== 1) {
                setPage((page) => page - 1);
              } else {
                fetchAllProjects();
              }
            } else {
              console.log("Delete failed - status:", status, "data:", data);
              notification({
                title: "Error",
                type: "danger",
                message: data?.message || "Delete failed",
              });
            }
          })
          .catch((err: Error) => {
            notification({
              title: "Error",
              type: "danger",
              message: err.message,
            });
          });
      },
      id,
    });
  };

  const columns: Column[] = [
    {
      name: "title",
      label: "Title",
      width: 100,
      align: "center",
    },
    {
      name: "description",
      label: "Description",
      align: "center",
      width: 100,
    },
    {
      name: "status",
      label: "Status",
      align: "center",
      width: 100,
    },
    {
      name: "action",
      label: "",
      align: "left",
    },
  ];

  const handleViewDetails = (id: string | number): void => {
    navigate(`/project-details/${id}`);
  };

  const rows: ProjectRow[] = (records || []).map((row: Project) => {
    const action = (
      <div className="d-flex gap-1">
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleViewDetails(row._id)}
          title="View Project Details"
        >
          <i className="fas fa-eye me-1"></i>
          Details
        </button>
        <TableActionCell
          actionsHeadline="Edit"
          hideEdit={false}
          editLabel="Edit"
          onEdit={handleEdit}
          hideDestroy={false}
          tableRow={{ rowId: row._id }}
          onDestroy={handleDestroy}
        />
      </div>
    );
    return {
      ...row,
      action,
      title: row.title ? row.title : "",
      name: row.name ? row.name : row.title || "",
      description: row.description ? row.description : "-",
      status: row.status ? row.status : "-"
    };
  });

  if (isLoading) {
    return <Loader />;
  } else if (!(records || []).length) {
    return (
      <div>
        <AddButton show={show} setShow={setShow} />
        <NoRecordFound />
        <AbstractModal
          show={show}
          handleClose={handleClose}
          Component={
            <CreateProjectForm
              handleClose={handleClose}
              fetchAllProjects={fetchAllProjects}
            />
          }
          editComponent={
            <UpdateProjectForm
              id={Id}
              handleClose={handleClose}
              fetchAllProjects={fetchAllProjects}
            />
          }
          heading="Project"
        />
      </div>
    );
  }

  const handleSortingChange = (): void => {
    // console.log("Handle Sorting Change");
  };

  const handleSelect = (): void => {};

  return (
    <div>
      <List
        rows={rows}
        loading={isLoading}
        columns={columns}
        onSortingChange={handleSortingChange}
        title="Project List" // Fixed title
        handleSelect={handleSelect}
        AddButton={<AddButton show={show} setShow={setShow} />}
        ReactPaginate={
          <PaginationComponent
            handlePageChange={handlePageChange}
            currentPage={page}
            pageCount={Math.ceil((count || 0) / 10)}
          />
        }
      />
      <AbstractModal
        show={show}
        handleClose={handleClose}
        Component={
          <CreateProjectForm
            handleClose={handleClose}
            fetchAllProjects={fetchAllProjects}
          />
        }
        editComponent={
          <UpdateProjectForm
            id={Id}
            handleClose={handleClose}
            fetchAllProjects={fetchAllProjects}
          />
        }
        heading="Project"
      />
    </div>
  );
};

export default ProjectList;