import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getTags } from "../../services/tagService";
import useFetch from "../../hooks/useFetch";

export default function TagsWidget({ limit = 12 }) {
    const fetchTags = useCallback(async () => {
        const response = await getTags({ status: "Active", per_page: limit });
        return response?.data || [];
    }, [limit]);

    const { data: tags, loading, error, refetch } = useFetch(fetchTags);

    if (loading) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Tags</h3>
                <div className="d-flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton badge-tag-skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Tags</h3>
                <div className="alert alert-danger py-2 small mb-0">
                    {error}
                    <button
                        type="button"
                        className="btn btn-link btn-sm p-0 ms-2"
                        onClick={refetch}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!tags || tags.length === 0) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Tags</h3>
                <p className="text-muted small mb-0">No tags available.</p>
            </div>
        );
    }

    return (
        <div className="sidebar-widget">
            <h3 className="sidebar-widget-title">
                <i className="bi bi-tags me-2" aria-hidden="true" />
                Tags
            </h3>
            <div className="sidebar-tags d-flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link
                        key={tag.id}
                        to={`/tag/${tag.slug}`}
                        className="badge-tag text-decoration-none"
                    >
                        #{tag.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
