import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectList from "../components/lists/project";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/project");
  }, [navigate]);
  return null;
};

export default Dashboard;
