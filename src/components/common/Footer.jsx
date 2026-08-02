import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { getCategories } from "../../services/categoryService";
import { subscribeNewsletter } from "../../services/newsletterService";

export default function Footer() {
    const {settings, menus } = useBlog();
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    useEffect(() => {
        loadFooterCategories();
    }, []);

    const loadFooterCategories = async () => {
        try {
            const data = await getCategories();
            // CategoryResource wraps list in a data parameter
            const categoryList = data?.data || data || [];
            // Limit to 5 categories
            setCategories(categoryList.slice(0, 5));
        } catch (error) {
            console.error("Footer category load error:", error);
        }
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            setSubmitting(true);
            setStatus({ type: "", message: "" });
            await subscribeNewsletter(email);
            setStatus({
                type: "success",
                message: "Thank you for subscribing to our newsletter!"
            });
            setEmail("");
        } catch (err) {
            setStatus({
                type: "danger",
                message: err.message || "Failed to subscribe. Email may already be subscribed."
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Find Footer menu if exists
    const footerMenu = menus?.find(m => m.location === "Footer" && m.status === "Active");
    const footerMenuItems = footerMenu?.items || [];

    // Fallback Quick Links
    const fallbackQuickLinks = [
        { title: "Home", url: "/" },
        { title: "Blog", url: "/blog" },
        { title: "About Us", url: "/about" },
        { title: "Contact Us", url: "/contact" }
    ];

    const siteName = settings?.site_name || "Blog CMS";
    const tagline = settings?.site_tagline || "Your thoughts, shared with the world.";
    // const copyrightText = settings?.copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
    const copyrightText =  `© ${new Date().getFullYear()}. All rights reserved by Tahir's Tech & Co.`;

    return (
        <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
            <div className="container">
                <div className="row g-4">
                    {/* Brand Info Section */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="fw-bold text-uppercase tracking-wider mb-3 text-white">
                            {siteName}
                        </h5>
                        <p className="text-secondary small mb-4">
                            {tagline}
                        </p>
                        {/* Social Links */}
                        <div className="d-flex gap-3">
                            {settings?.facebook_url && (
                                <a href={settings.facebook_url} className="text-secondary fs-5 hover-white" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-facebook"></i>
                                </a>
                            )}
                            {settings?.twitter_url && (
                                <a href={settings.twitter_url} className="text-secondary fs-5 hover-white" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-twitter-x"></i>
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} className="text-secondary fs-5 hover-white" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-instagram"></i>
                                </a>
                            )}
                            {settings?.linkedin_url && (
                                <a href={settings.linkedin_url} className="text-secondary fs-5 hover-white" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-linkedin"></i>
                                </a>
                            )}
                            {settings?.youtube_url && (
                                <a href={settings.youtube_url} className="text-secondary fs-5 hover-white" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-youtube"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="text-uppercase fw-bold text-white mb-3">Quick Links</h6>
                        <ul className="list-unstyled mb-0">
                            {(footerMenuItems.length > 0 ? footerMenuItems : fallbackQuickLinks).map((link, idx) => (
                                <li key={idx} className="mb-2">
                                    <Link to={link.url || "/"} className="text-secondary hover-white small transition-smooth">
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Dynamic Categories Section */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="text-uppercase fw-bold text-white mb-3">Categories</h6>
                        <ul className="list-unstyled mb-0">
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <li key={cat.id} className="mb-2">
                                        <Link to={`/category/${cat.slug}`} className="text-secondary hover-white small transition-smooth">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-secondary small">No categories found</li>
                            )}
                        </ul>
                    </div>

                    {/* Newsletter Subscription Column */}
                    <div className="col-lg-4 col-md-6">
                        <h6 className="text-uppercase fw-bold text-white mb-3">Subscribe</h6>
                        <p className="text-secondary small mb-3">
                            Subscribe to receive the latest stories and updates in your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="mb-2">
                            <div className="input-group">
                                <input
                                    type="email"
                                    className="form-control bg-dark border-secondary text-white"
                                    placeholder="Your email address"
                                    aria-label="Email for Newsletter"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={submitting}
                                />
                                <button className="btn btn-primary" type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <i className="bi bi-send"></i>
                                    )}
                                </button>
                            </div>
                        </form>
                        {status.message && (
                            <div className={`alert alert-${status.type} py-2 px-3 small border-0 mt-2`} role="alert">
                                {status.message}
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-secondary my-4" />

                <div className="row">
                    <div className="col text-center">
                        <p className="text-secondary small mb-0">
                            {copyrightText}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}