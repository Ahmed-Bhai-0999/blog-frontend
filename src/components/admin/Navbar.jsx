import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {

    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (e) {}

        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/admin/login");
    };

    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">

            <div className="container-fluid">
                <h4 className="mb-0">Tahir Tech & co. </h4>

                <div className="ms-auto d-flex align-items-center">

                    {/* Search */}
                    <div className="me-4">
                        <input className="form-control" placeholder="Search..." />
                    </div>

                    {/* Notification */}
                    <button className="btn position-relative me-3">
                        <i className="bi bi-bell fs-5"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            3
                        </span>
                    </button>

                    {/* User */}
                    <div className="dropdown">
                        <button className="btn dropdown-toggle d-flex align-items-center"
                            data-bs-toggle="dropdown" >

                            <img src="https://ui-avatars.com/api/?name=Admin" width="40"
                                className="rounded-circle me-2" />
                            {user?.name}

                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item">
                                    <i className="bi bi-person me-2"></i>
                                    Profile
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item">
                                    <i className="bi bi-gear me-2"></i>
                                    Settings
                                </button>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="dropdown-item text-danger" >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Logout
                                </button>
                            </li>
                        </ul>

                    </div>

                </div>

            </div>

        </nav>

    );
}