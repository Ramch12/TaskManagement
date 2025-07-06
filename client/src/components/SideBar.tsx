import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Typography, Switch } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { SidebarHeader } from "./sidebar/SideBarHeader";
import Header from "./Header";
import { hexToRgba, themes, Themes } from "../service";
import { setCollapse } from "../reducers/sidebar";
import { RootState } from "../store";

interface SidebarPageProps {
  component: React.ReactNode;
}

const routes = [
  {
    link: "/project",
    icon: <AccountTreeIcon />,
    label: "Projects",
  },
  {
    link: "/task",
    icon: <AddTaskIcon />,
    label: "Task",
  },
];

const SidebarPage: React.FC<SidebarPageProps> = ({ component }) => {
  const [theme, setTheme] = useState<keyof Themes>("light");
  const { collapsed } = useSelector((state: RootState) => state.sidebar);
  const dispatch = useDispatch();
  const location = useLocation();
  const [toggled, setToggled] = React.useState<boolean>(false);
  // console.log('location.pathname', location.pathname);
  const menuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      ["&.ps-disabled"]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }: { level: number }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes[theme].menu.menuContent, 1)
          : "transparent",
    }),
    button: {
      ["&.ps-disabled"]: {
        color: themes[theme].menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, 1),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }: { open: boolean }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        breakPoint="md"
        backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 1)}
        rootStyles={{
          color: themes[theme].sidebar.color,
          height: "100vh",
          overflowY: "auto",
          width: "20%",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <SidebarHeader
            style={{ marginBottom: "24px", marginTop: "16px" }}
            theme={theme}
            setTheme={setTheme}
            collapsed={collapsed}
          />
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <div style={{ padding: "0 24px", marginBottom: "8px" }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: collapsed ? 0 : 0.7,
                  letterSpacing: "0.5px",
                }}
              >
                General
              </Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles as any}>
              {routes.map((route, key) =>
                (
                  <MenuItem
                    active={location.pathname.includes(route.link)}
                    key={key}
                    component={<Link to={route.link} />}
                    icon={route.icon}
                  >
                    {route.label}
                  </MenuItem>
                )
              )}
            </Menu>
          </div>
          <div
            style={{
              paddingTop: 20,
              display: "flex",
              flexDirection: collapsed ? "column" : "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {!collapsed && <Typography>Collapse</Typography>}
            <Switch
              id="collapse"
              checked={collapsed}
              onChange={() => dispatch(setCollapse({ collapsed: !collapsed }))}
              // @ts-ignore
              label="Collapse"
            />
          </div>
        </div>
      </Sidebar>
      <div
        style={{
          width: collapsed ? "94%" : "80%",
          transition: "0.3s",
          transitionTimingFunction: "ease-out",
          backgroundColor: "#f8f9fc",
        }}
      >
        <Header />
        <div className="content-container">{component}</div>
      </div>
    </div>
  );
};

export default SidebarPage; 