import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import List from "../List";
import TableActionCell from "../TableActionCell";
import { fetchTasks, deleteTask } from "../../../API/task";
import { useAuth } from "../../../Hooks/useAuth";
import { notification } from "../../../service/index";
import Loader from "../../common/Loader";
import NoRecordFound from "../../common/NoRecordFound";
import AddButton from "../../common/AddButton";
import PaginationComponent from "../../common/ReactPaginate";
import AbstractModal from "../../AbstractModal";
import CreateTaskForm from "../../forms/task/CreateTaskForm";
import { useDispatch } from "react-redux";
import { openModal } from "../../../reducers/modal";
import UpdateTaskForm from "../../forms/task/UpdateTaskForm";
import { deletePopup } from "../../../service/index";
import SelectField from "../../common/SelectField";

// Type definitions
interface Task {
  _id: string | number;
  title: string;
  name?: string;
  description?: string | number;
  status?: string;
  dueDate?: string;
  projectId?: string;
}


interface TaskRow extends Task {
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

interface ApiResponse {
  data: null;
  message: string;
  tasks?: {
    docs: Task[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: null | number;
    nextPage: null | number;
  };
}

interface DeleteResponse {
  status: boolean;
}

interface AuthHook {
  token: string;
}

interface StatusFilterOption {
  id: string;
  name: string;
}

const TaskList: React.FC = () => {
  const [records, setRecords] = useState<Task[]>([]);
  const [Id, setId] = useState<string | number | null>(null);
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { token } = useAuth() as AuthHook;
  const navigate = useNavigate();
  const { state, search } = useLocation();

  const statusFilterOptions: StatusFilterOption[] = [
    { id: "all", name: "All Tasks" },
    { id: "todo", name: "Todo" },
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
  ];

  const fetchAllTasks = (): void => {
    setIsLoading(true);
    
    const queryParams = new URLSearchParams();
    if (statusFilter !== "all") {
      queryParams.append("status", statusFilter);
    }
    queryParams.append("page", (page + 1).toString());
    queryParams.append("limit", "10");
    
    const queryString = queryParams.toString();
    const url = `/api/v1/task/getAlltask?${queryString}`;
    
    fetchTasks(token, url)
      .then(({ data }: { data: ApiResponse }) => {
        if (data && data.tasks) {
          setRecords(data.tasks.docs || []);
          setCount(data.tasks.totalDocs || 0);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        notification({ title: "Error", message: err.message, type: "danger" });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAllTasks();
  }, [page, statusFilter]);

  useEffect(() => {
    if (search === "?tab=add_new_task") {
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
    if (search === "?tab=add_new_task") {
      navigate("/task");
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
      message: "Are you sure you want to delete this task?",
      onConfirm: () => {
        console.log("Deleting task with ID:", id);
        deleteTask(id, token)
          .then(({ status, data }: { status: number; data?: any }) => {
            console.log("Task delete response:", { status, data });
            if (status === 200) {
              notification({
                title: "Deleted",
                type: "success",
                message: "Task successfully deleted!",
              });
              if (count && count % 10 === 1 && count !== 1) {
                setPage((page) => page - 1);
              } else {
                fetchAllTasks();
              }
            } else {
              console.log("Task delete failed - status:", status, "data:", data);
              notification({
                title: "Error",
                type: "danger",
                message: data?.message || "Failed to delete task",
              });
            }
          })
          .catch((err: Error) => {
            notification({
              title: "Error",
              type: "danger",
              message: err.message || "An error occurred while deleting the task",
            });
          });
      },
      id,
    });
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
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
      name: "dueDate",
      label: "Due Date",
      align: "center",
      width: 100,
    },
    {
      name: "action",
      label: "",
      align: "left",
    },
  ];

  const rows: TaskRow[] = (records || []).map((row: Task) => {
    const action = (
      <TableActionCell
        actionsHeadline="Edit"
        hideEdit={false}
        editLabel="Edit"
        onEdit={handleEdit}
        hideDestroy={false}
        tableRow={{ rowId: row._id }}
        onDestroy={handleDestroy}
      />
    );
    
    // Format the due date
    const formatDueDate = (dateString: string) => {
      if (!dateString) return "-";
      try {
        return new Date(dateString).toLocaleDateString();
      } catch {
        return dateString;
      }
    };
    
    return {
      ...row,
      action,
      title: row.title ? row.title : "",
      name: row.name ? row.name : row.title || "",
      description: row.description ? row.description : "-",
      status: row.status ? row.status : "-",
      dueDate: row.dueDate ? formatDueDate(row.dueDate) : "-"
    };
  });

  if (isLoading) {
    return <Loader />;
  }

  const handleSortingChange = (): void => {
    // console.log("Handle Sorting Change");
  };

  const handleSelect = (): void => {};

  return (
    <div>
      {/* Filter Section - Always visible */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="statusFilter" className="form-label">Filter by Status:</label>
          <select
            id="statusFilter"
            className="form-select"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            {statusFilterOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show NoRecordFound only when not loading and no records */}
      {!isLoading && !(records || []).length ? (
        <>
          <AddButton show={show} setShow={setShow} />
          <NoRecordFound />
        </>
      ) : (
        <List
          rows={rows}
          loading={isLoading}
          columns={columns}
          onSortingChange={handleSortingChange}
          title="Task List"
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
      )}

      <AbstractModal
        show={show}
        handleClose={handleClose}
        Component={
          <CreateTaskForm
            handleClose={handleClose}
            fetchAllTasks={fetchAllTasks}
          />
        }
        editComponent={
          <UpdateTaskForm
            id={Id}
            handleClose={handleClose}
            fetchAllTasks={fetchAllTasks}
          />
        }
        heading="Task"
      />
    </div>
  );
};

export default TaskList;