import { Link } from "react-router-dom";
import { memo } from "react";
import LazyImage from "../common/LazyImage";
import { formatDate, formatViews, truncateText } from "../../utils/helpers";

function FeaturedPostCard({ post }) {
    if (!post) return null;

    const {
        slug,
        title,
        excerpt,
        featured_image,
        category,
        author,
        published_at,
        views,
    } = post;

    return (
        <article className="premium-card featured-post-card h-100">
            <Link to={`/post/${slug}`} className="text-decoration-none">
                <div className="zoom-img-container featured-post-image">
                    <LazyImage
                        src={featured_image}
                        alt={title}
                        className="zoom-img featured-post-img"
                        fallbackType="post"
                        aspectRatio="aspect-ratio-16-10"
                    />
                    <div className="featured-post-overlay">
                        {category?.name && (
                            <span className="badge bg-primary mb-2">
                                {category.name}
                            </span>
                        )}
                        <h3 className="h5 text-white mb-2 featured-post-title">
                            {title}
                        </h3>
                        {excerpt && (
                            <p className="text-white-50 small mb-0 d-none d-md-block">
                                {truncateText(excerpt, 80)}
                            </p>
                        )}
                    </div>
                </div>
            </Link>

            <div className="card-body p-3 p-md-4">
                <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mb-3">
                    {author?.name && (
                        <span>
                            <i className="bi bi-person-circle me-1" aria-hidden="true" />
                            <Link
                                to={`/author/${author.id}`}
                                className="text-muted text-decoration-none"
                            >
                                {author.name}
                            </Link>
                        </span>
                    )}
                    {published_at && (
                        <span>
                            <i className="bi bi-calendar3 me-1" aria-hidden="true" />
                            {formatDate(published_at)}
                        </span>
                    )}
                    <span>
                        <i className="bi bi-eye me-1" aria-hidden="true" />
                        {formatViews(views)} views
                    </span>
                </div>

                <Link
                    to={`/post/${slug}`}
                    className="btn btn-premium btn-sm w-100"
                >
                    Read More
                    <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
                </Link>
            </div>
        </article>
    );
}

export default memo(FeaturedPostCard);
