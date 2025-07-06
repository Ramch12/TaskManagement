import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { getProjectWithTasks } from '../API/project';
import { notification } from '../service';
import Loader from '../components/common/Loader';
import NoRecordFound from '../components/common/NoRecordFound';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  projectId: string;
  createdBy: string;
  __v: number;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: string;
  __v: number;
  Task: Task[];
}

interface ProjectWithTasksResponse {
  data: Project[];
  message: string;
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [tasksPerPage] = useState<number>(10);

  useEffect(() => {
    if (!projectId || !token) {
      setError('Project ID or token not found');
      setLoading(false);
      return;
    }

    fetchProjectDetails();
  }, [projectId, token]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await getProjectWithTasks(token!, projectId!);
      const data: ProjectWithTasksResponse = response.data;
      
      if (data.data && data.data.length > 0) {
        setProject(data.data[0]);
      } else {
        setError('Project not found');
      }
    } catch (err: any) {
      console.error('Error fetching project details:', err);
      setError(err.response?.data?.message || 'Failed to fetch project details');
      notification({
        message: err.response?.data?.message || 'Failed to fetch project details',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'todo':
        return 'badge bg-warning text-dark';
      case 'in-progress':
        return 'badge bg-primary';
      case 'done':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBackToProjects = () => {
    navigate('/project');
  };

  const indexOfLastTask = (currentPage + 1) * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  if (loading) {
    return <Loader />;
  }

  if (error || !project) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              {error || 'Project not found'}
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleBackToProjects}
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">{project.title}</h2>
              <p className="text-muted mb-0">{project.description}</p>
            </div>
            <div>
              <button 
                className="btn btn-outline-primary me-2"
                onClick={handleBackToProjects}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Projects
              </button>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Project Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Title:</strong> {project.title}</p>
                  <p><strong>Description:</strong> {project.description}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Status:</strong> 
                    <span className={`ms-2 ${getStatusBadgeClass(project.status)}`}>
                      {project.status}
                    </span>
                  </p>
                  <p><strong>Total Tasks:</strong> {project.Task?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Project Tasks</h5>
              <span className="badge bg-primary">{project.Task?.length || 0} tasks</span>
            </div>
            <div className="card-body">
              {!project.Task || project.Task.length === 0 ? (
                <NoRecordFound message="No tasks found for this project" />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th className="text-start" style={{ width: '25%' }}>Title</th>
                        <th className="text-start" style={{ width: '40%' }}>Description</th>
                        <th className="text-center" style={{ width: '15%' }}>Status</th>
                        <th className="text-center" style={{ width: '20%' }}>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.Task.map((task) => (
                        <tr key={task._id}>
                          <td className="text-start align-middle">
                            <strong>{task.title}</strong>
                          </td>
                          <td className="text-start align-middle">
                            <span className="text-muted">
                              {task.description.length > 50 
                                ? `${task.description.substring(0, 50)}...` 
                                : task.description
                              }
                            </span>
                          </td>
                          <td className="text-center align-middle">
                            <span className={getStatusBadgeClass(task.status)}>
                              {task.status}
                            </span>
                          </td>
                          <td className="text-center align-middle">
                            <span className="text-muted">
                              {formatDate(task.dueDate)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 