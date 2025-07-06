import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

//Forms
import Login from "./components/forms/Login";
import SignUp from "./components/forms/SignUp";

//Pages
import HomePage from "./components/HomePage";
import PrivateRoute from "./components/PrivateRoutes";
import Task from "./pages/Task";
import ProjectDetails from "./pages/ProjectDetails";
import Dashboard from "./pages/Dashboard";

interface RoutersProps {
  auth: boolean;
}

const Routers: React.FC<RoutersProps> = ({ auth }) => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<PrivateRoute auth={auth} Component={Dashboard} />}
        />
        <Route
          path="/task"
          element={<PrivateRoute auth={auth} Component={Task} />}
        />
        <Route
          path="/project"
          element={<PrivateRoute auth={auth} Component={HomePage} />}
        />
        <Route
          path="/project-details/:projectId"
          element={<PrivateRoute auth={auth} Component={ProjectDetails} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default Routers; 