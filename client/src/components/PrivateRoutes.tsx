import React from "react";
import { Navigate } from "react-router-dom";
import SidebarPage from "./SideBar";

interface PrivateRouteProps {
    auth: boolean;
    Component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ auth, Component }) => {
    return (
        <>
            {
                auth ? <SidebarPage component={<Component />} />
                    : <Navigate to={'/login'} />
            }
        </>
    )
}

export default PrivateRoute;