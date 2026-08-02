import { Link } from "react-router-dom";
import { memo } from "react";
import { getCategoryIcon } from "../../utils/helpers";

function CategoryCard({ category, postsCount = 0 }) {
    if (!category) return null;

    const { slug, name, description } = category;
    const icon = getCategoryIcon(name);

    return (
        <Link
            to={`/category/${slug}`}
            className="category-card text-decoration-none"
        >
            <div className="category-card-icon">
                <i className={`bi ${icon}`} aria-hidden="true" />
            </div>
            <h3 className="h6 category-card-name mb-1">{name}</h3>
            {description && (
                <p className="category-card-desc small text-muted mb-2">
                    {description.length > 60
                        ? `${description.slice(0, 60).trim()}…`
                        : description}
                </p>
            )}
            <span className="category-card-count">
                {postsCount} {postsCount === 1 ? "Post" : "Posts"}
            </span>
            <span className="category-card-arrow">
                <i className="bi bi-arrow-right" aria-hidden="true" />
            </span>
        </Link>
    );
}

export default memo(CategoryCard);
