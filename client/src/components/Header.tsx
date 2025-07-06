import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { doLogout } from "../reducers/app";
import { notification } from "../service";
import { useAuth } from "../Hooks/useAuth";
import { HeaderIcon } from "../icons";

// Type definitions
interface AuthHook {
  token: string | null;
}

interface NotificationParams {
  message: string;
  type?: "success" | "danger" | "warning" | "info";
  title?: string;
}

interface LogoutResponse {
  status: number;
  data?: {
    status: boolean;
  };
}


const Header: React.FC = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useAuth() as AuthHook;

  const handleShowClick = (): void => {
    setShowMenu(false);
    setShow(!show);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(doLogout());
    notification({ message: "Logout Successfully!" } as NotificationParams);
    navigate("/login");
  };

  const handleMenuToggle = (): void => {
    setShowMenu(!showMenu);
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        borderBottom: "2px solid #eee",
      }}
      className="d-flex justify-content-between align-items-center py-2 shadow-lg p-2"
    >
      <div>
        <img src={HeaderIcon} alt="Logo" height={50} />
      </div>
      <div>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            cursor: "pointer",
            backgroundImage: 'url("/images/profile.png")',
            marginRight: "10px",
          }}
          className="header-profile position-relative"
          onClick={handleMenuToggle}
        >
          {showMenu && (
            <div className="position-absolute profile-menu">
              <span
                role="button"
                className="menu-btn"
                onClick={handleLogout}
              >
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;