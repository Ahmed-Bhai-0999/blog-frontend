import { Link } from "react-router-dom";
import { memo } from "react";
import LazyImage from "../common/LazyImage";
import {
    calculateReadingTime,
    truncateText,
} from "../../utils/helpers";

function PostCard({ post, showExcerpt = true }) {
    if (!post) return null;

    const {
        slug,
        title,
        excerpt,
        content,
        featured_image,
        category,
        author,
        published_at,
        views,
    } = post;

    const readingTime = calculateReadingTime(content || excerpt);

    return (
        <article className="premium-card post-card h-100">
            <Link to={`/post/${slug}`} className="text-decoration-none text-dark">
                <div className="zoom-img-container post-card-image">
                    <LazyImage
                        src={featured_image}
                        alt={title}
                        className="zoom-img post-card-img"
                        fallbackType="post"
                        aspectRatio="aspect-ratio-16-9"
                    />
                </div>
            </Link>

            <div className="card-body p-4 d-flex flex-column">
                {category?.name && (
                    <span className="badge bg-primary-subtle text-primary align-self-start mb-2">
                        {category.name}
                    </span>
                )}

                <h3 className="h5 card-title mb-2">
                    <Link to={`/post/${slug}`} className="text-dark text-decoration-none post-card-title">
                        {title}
                    </Link>
                </h3>

                {showExcerpt && excerpt && (
                    <p className="text-muted small mb-3 flex-grow-1">
                        {truncateText(excerpt, 100)}
                    </p>
                )}

                <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                        {author?.name && (
                            <span>
                                <i className="bi bi-person me-1" aria-hidden="true" />
                                {author.name}
                            </span>
                        )}
                        <span className="text-muted opacity-50">•</span>
                        <span>{readingTime}</span>
                    </div>

                    <Link
                        to={`/post/${slug}`}
                        className="btn btn-sm btn-outline-primary rounded-pill"
                    >
                        Read More
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default memo(PostCard);
