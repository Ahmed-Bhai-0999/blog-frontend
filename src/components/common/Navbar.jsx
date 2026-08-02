import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
    const { settings, menus } = useBlog();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Detect login changes
        const checkUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();
        // Listen to storage events to update user state if logged in/out in another tab
        window.addEventListener("storage", checkUser);
        return () => window.removeEventListener("storage", checkUser);
    }, [location]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setIsSearchOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
        // Trigger a custom storage event so other listeners update
        window.dispatchEvent(new Event("storage"));
    };

    // Find Header menu from DB
    const headerMenu = menus?.find(
        (m) => m.location === "Header" && m.status === "Active"
    );
    const menuItems = headerMenu?.items || [];

    // Fallback menu links
    const fallbackLinks = [
        { title: "Home", url: "/" },
        { title: "Blog", url: "/blog" },
        { title: "About", url: "/about" },
        { title: "Contact", url: "/contact" },
    ];

    const renderMenuLink = (item) => {
        const title = item.title;
        let url = item.url;
        const target = item.target || "_self";

        // Check if page relation exists
        if (item.page) {
            const slug = item.page.slug;
            if (slug === "about") url = "/about";
            else if (slug === "contact") url = "/contact";
            else url = `/page/${slug}`;
        }

        // If URL is external
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
            return (
                <a
                    key={item.id || title}
                    className="nav-link"
                    href={url}
                    target={target}
                    rel="noopener noreferrer"
                >
                    {item.icon && <i className={`bi ${item.icon} me-1`}></i>}
                    {title}
                </a>
            );
        }

        // Internal Router Link
        return (
            <Link
                key={item.id || title}
                className={`nav-link ${location.pathname === url ? "active text-primary fw-semibold" : ""}`}
                to={url || "/"}
            >
                {item.icon && <i className={`bi ${item.icon} me-1`}></i>}
                {title}
            </Link>
        );
    };

    const logoUrl = settings?.logo || settings?.site_logo;
    const siteName = settings?.site_name || "Blog CMS";

    return (
        <nav className="navbar navbar-expand-lg navbar-light sticky-navbar py-3">
            <div className="container">
                {/* Logo & Brand */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={siteName}
                            height="36"
                            className="me-2"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    ) : null}
                    <span className="fw-bold tracking-tight text-dark h4 mb-0">
                        {siteName}
                    </span>
                </Link>

                {/* Mobile Search & Burger */}
                <div className="d-flex align-items-center order-lg-3 gap-2">
                    <button
                        className="btn btn-link text-dark p-2 nav-link"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Toggle Search"
                    >
                        <i className="bi bi-search fs-5"></i>
                    </button>

                    {!user ? (
                        <Link to="/admin/login" className="btn ">
                            <i className="bi bi-box-arrow-in-right me-1"></i>
                            Login
                        </Link>
                    ) : (
                        <div className="dropdown"> 
                            {/* <div className="d-flex align-items-center gap-2 mb-2">
                                <NotificationBell />
                            </div> */}
                            <button
                                className="btn btn-link text-dark nav-link dropdown-toggle d-flex align-items-center gap-2"
                                type="button" id="userDropdown" data-bs-toggle="dropdown" 
                            >
                                {/* <img src={user.avatar || "/images/default-avatar.png"}
                                    alt="avatar" width="35" height="35" className="rounded-circle" /> */}

                                <span className="d-none d-md-inline"> {user.name}</span>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end shadow border-0"
                                aria-labelledby="userDropdown" >
                                <li>
                                    <span className="dropdown-item-text small text-muted">
                                        <strong>{user.email}</strong>
                                    </span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/profile">
                                        <i className="bi bi-person me-2"></i>
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/notifications">
                                        <i className="bi bi-bell me-2"></i>
                                        Notifications
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/my-comments">
                                        <i className="bi bi-chat-left-text me-2"></i>
                                        My Comments
                                    </Link>
                                </li>

                                {user.role === "Admin" || user.role === "Super Admin" ? (
                                    <>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/admin/dashboard" >
                                                <i className="bi bi-speedometer2 me-2"></i>
                                                Dashboard
                                            </Link>
                                        </li>
                                    </>
                                ) : null}

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout} >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    <button
                        className="navbar-toggler border-0 p-2 focus-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                        aria-controls="navbarContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list fs-3"></i>
                    </button>
                </div>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarContent">
                    <div className="navbar-nav mx-auto gap-1 gap-lg-3 mt-3 mt-lg-0">
                        {menuItems.length > 0
                            ? menuItems.map((item) => {
                                  // Handle sub-menu children dropdown
                                  if (item.children && item.children.length > 0) {
                                      return (
                                          <div key={item.id} className="nav-item dropdown" >
                                              <button
                                                  className="nav-link dropdown-toggle"
                                                  type="button"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"
                                              >
                                                  {item.title}
                                              </button>
                                              <ul className="dropdown-menu shadow border-0 py-2">
                                                  {item.children.map((child) => (
                                                      <li key={child.id}>
                                                          {renderMenuLink({
                                                              ...child,
                                                              id: child.id,
                                                              className:
                                                                  "dropdown-item",
                                                          })}
                                                      </li>
                                                  ))}
                                              </ul>
                                          </div>
                                      );
                                  }
                                  return renderMenuLink(item);
                              })
                            : fallbackLinks.map((item) => renderMenuLink(item))}
                    </div>
                </div>
            </div>

            {/* Sliding Search Bar Drawer */}
            {isSearchOpen && (
                <div
                    className="position-absolute w-100 start-0 bg-white border-bottom py-3 shadow-sm"
                    style={{ top: "100%", zIndex: 1000 }}
                >
                    <div className="container">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0 text-muted">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    className="form-control border-start-0 focus-none"
                                    placeholder="Search stories, topics, authors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
}