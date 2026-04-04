import React, { useState, useContext } from "react";
import useNavigate from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";

export default function Sidebar({children}) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const { state } = useContext(AuthContext);
  const { user, isAuthenticated } = state;

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="d-flex">
      {/* SIDEBAR */}
      <div
        className={`bg-dark text-white p-3 vh-100 ${
          collapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
        style={{
          width: collapsed ? "80px" : "250px",
          transition: "width 0.3s",
        }}
      >
        {/* Toggle Button */}
        <button
          className="btn btn-outline-light mb-4 w-100"
          onClick={() => {setCollapsed(!collapsed); setOpenMenu(null);}}
        >
          ☰
        </button>

        {/* Menu */}
        <ul className="nav flex-column">

          { user && user.role === "Admin" ? <li className="nav-item mb-2">
            <button className="nav-link text-white" onClick={() => {toggleMenu("students"); setCollapsed(false);}}>
              👨‍🎓 {!collapsed && "Students"}
            {!collapsed && (
              <span className="float-end">
                {openMenu === "students" ? "▲" : "▼"}
              </span>
            )}
          </button>

          {/* Submenu */}
          <div
            className={`collapse ${
              openMenu === "students" ? "show" : ""
            }`}
          >
            <ul className="nav flex-column ms-3">

              <li className="nav-item">
                <a href="/add-student" className="nav-link text-white small">
                  ➤ Add Student
                </a>
              </li>

              <li className="nav-item">
                <a href="/view-students" className="nav-link text-white small">
                  ➤ View Students
                </a>
              </li>

            </ul>
            </div>
          </li> : null
          }

          <li className="nav-item mb-2">
            <button className="nav-link text-white" onClick={() => {toggleMenu("attendance"); setCollapsed(false);}}>
              📅 {!collapsed && "Attendance"}
            {!collapsed && (
              <span className="float-end">
                {openMenu === "attendance" ? "▲" : "▼"}
              </span>
            )}
          </button>

          {/* Submenu */}
          <div
            className={`collapse ${
              openMenu === "attendance" ? "show" : ""
            }`}
          >
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a href="/home" className="nav-link text-white small">
                  ➤ View Attendance
                </a>
              </li>

            </ul>
            </div>
          </li>

          { user && user.role === "Admin" ? <li className="nav-item mb-2">
            <button className="nav-link text-white" onClick={() => {setCollapsed(false); toggleMenu("courses"); }}>
              &#128214; {!collapsed && "Courses"}
            {!collapsed && (
              <span className="float-end">
                {openMenu === "courses" ? "▲" : "▼"}
              </span>
            )}
          </button>

          {/* Submenu */}
          <div
            className={`collapse ${
              openMenu === "courses" ? "show" : ""
            }`}
          >
            <ul className="nav flex-column ms-3">

              <li className="nav-item">
                <a href="/course/add" className="nav-link text-white small">
                  ➤ Add Courses
                </a>
              </li>

              <li className="nav-item">
                <a href="/course/view" className="nav-link text-white small">
                  ➤ View Courses
                </a>
              </li>

            </ul>
            </div>
          </li> : null
          }
        </ul>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
}