import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";
import useFetch from "../../hooks/useFetch";
import { getCategoryIcon } from "../../utils/helpers";

export default function CategoriesWidget({ limit = 8 }) {
    const fetchCategories = useCallback(async () => {
        const response = await getCategories({ status: "Active", per_page: limit });
        return response?.data || [];
    }, [limit]);

    const { data: categories, loading, error, refetch } = useFetch(fetchCategories);

    if (loading) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Categories</h3>
                <div className="d-flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton skeleton-text w-25" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Categories</h3>
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

    if (!categories || categories.length === 0) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Categories</h3>
                <p className="text-muted small mb-0">No categories found.</p>
            </div>
        );
    }

    return (
        <div className="sidebar-widget">
            <h3 className="sidebar-widget-title">
                <i className="bi bi-grid me-2" aria-hidden="true" />
                Categories
            </h3>
            <ul className="sidebar-category-list list-unstyled mb-0">
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link
                            to={`/category/${category.slug}`}
                            className="sidebar-category-link"
                        >
                            <i
                                className={`bi ${getCategoryIcon(category.name)} me-2`}
                                aria-hidden="true"
                            />
                            {category.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
