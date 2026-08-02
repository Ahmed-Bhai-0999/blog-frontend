import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const menuClass = ({ isActive }) =>
        `nav-link d-flex align-items-center text-white px-3 py-2 rounded mb-2 ${
            isActive ? "bg-primary" : ""
        }`;

    return (
        <div
            className="bg-dark text-white shadow"
            style={{
                width: "260px",
                minHeight: "100vh",
                flexShrink: 0,
            }}
        >
            <div className="border-bottom border-secondary p-2">
                <h2 className="text-center mb-0 text-white">B-A Blog Admin</h2>
            </div>

            <ul className="nav flex-column p-3">

                <li>
                    <NavLink to="/admin/dashboard" className={menuClass} >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/posts" className={({ isActive }) =>
                            isActive ? "nav-link active text-white" : "nav-link text-white"}
                    >
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Posts
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/categories" className={menuClass} >
                        <i className="bi bi-folder me-2"></i>
                        Categories
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/tags" className={menuClass} >
                        <i className="bi bi-tags me-2"></i>
                        Tags
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/comments" className={menuClass} >
                        <i className="bi bi-chat-left-text me-2"></i>
                        Comments
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/users" className={menuClass} >
                        <i className="bi bi-people me-2"></i>
                        Users
                    </NavLink>
                </li>

                <hr className="text-secondary" />

                <li>
                    <NavLink to="/admin/pages" className={menuClass} >
                        <i className="bi bi-file-richtext me-2"></i>
                        Pages
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/sliders" className={menuClass}>
                        <i className="bi bi-images me-2"></i>
                        Sliders
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/contacts" className={menuClass}>
                        <i className="bi bi-images me-2"></i>
                        Contact Message
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/menus" className={menuClass} >
                        <i className="bi bi-menu-button-wide me-2"></i>
                        Menus
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/notifications" className={menuClass}>
                        <i className="bi bi-bell me-2"></i>
                        Notifications
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/settings" className={menuClass} >
                        <i className="bi bi-gear me-2"></i>
                        Settings
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/seo-settings" className={menuClass}>
                        <i className="bi bi-google me-2"></i>
                        SEO Setting
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/newsletters" className={menuClass}>
                        <i className="bi bi-envelope me-2"></i>
                        Newsletter
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/activity-logs" className={menuClass} >
                        <i className="bi bi-clock-history me-2"></i>
                        Activity Logs
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}