import { useState } from "react";
import menuItems from "../../config/menuConfig";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
      {menuItems.map((item) => {
        const hasChildren = item.children?.length > 0;

        return (
          <div key={item.label}>
            <div
              onClick={() => {
                if (hasChildren) {
                  toggleMenu(item.label);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              style={{
                cursor: hasChildren ? "pointer" : "default",
              }}
            >
              {hasChildren
                ? openMenus[item.label]
                  ? "▼ "
                  : "▶ "
                : ""}
              {item.label}
            </div>

            {hasChildren && openMenus[item.label] && (
              <ul>
                {item.children.map((child) => (
                  <li
                    key={child.label}
                    onClick={() => child.path && navigate(child.path)}
                    className={
                      location.pathname === child.path
                        ? "menu-item-active"
                        : ""
                    }
                    style={{
                      cursor: child.path ? "pointer" : "default",
                    }}
                  >
                    {child.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}

export default Sidebar;