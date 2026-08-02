import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeNewsletter } from "../../services/newsletterService";

export default function SearchWidget() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
            setQuery("");
        }
    };

    return (
        <div className="sidebar-widget">
            <h3 className="sidebar-widget-title">
                <i className="bi bi-search me-2" aria-hidden="true" />
                Search
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search articles..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search articles"
                    />
                    <button className="btn btn-primary" type="submit" aria-label="Submit search">
                        <i className="bi bi-arrow-right" aria-hidden="true" />
                    </button>
                </div>
            </form>
        </div>
    );
}
