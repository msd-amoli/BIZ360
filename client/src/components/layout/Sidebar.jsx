import { useState } from "react";
import menuItems from "../../config/menuConfig";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-menu-wrapper">
        {menuItems.map((item) => {
          const hasChildren = item.children?.length > 0;
          const isParentActive = item.path && location.pathname === item.path;

          return (
            <div key={item.label} className="sidebar-group">
              {/* Parent Menu Item */}
              <div
                className={`sidebar-parent-item ${isParentActive ? "parent-active" : ""}`}
                onClick={() => {
                  if (hasChildren) {
                    toggleMenu(item.label);
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <span className="parent-label-text">{item.label}</span>
                {hasChildren && (
                  <span className={`arrow-indicator ${openMenus[item.label] ? "rotated" : ""}`}>
                    ▲
                  </span>
                )}
              </div>

              {/* Child Menu Items */}
              {hasChildren && openMenus[item.label] && (
                <ul className="sidebar-child-list">
                  {item.children.map((child) => {
                    const isChildActive = location.pathname === child.path;
                    return (
                      <li
                        key={child.label}
                        onClick={() => child.path && navigate(child.path)}
                        className={`sidebar-child-item ${isChildActive ? "menu-item-active" : ""}`}
                        style={{ cursor: child.path ? "pointer" : "default" }}
                      >
                        {child.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;