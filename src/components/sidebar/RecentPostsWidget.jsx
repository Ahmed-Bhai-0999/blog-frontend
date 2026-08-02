import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getRecentPosts } from "../../services/postService";
import useFetch from "../../hooks/useFetch";
import LazyImage from "../common/LazyImage";
import { formatDate } from "../../utils/helpers";
import { SidebarWidgetSkeleton } from "../common/SkeletonLoader";

export default function RecentPostsWidget({ limit = 5 }) {
    const fetchRecent = useCallback(async () => {
        const response = await getRecentPosts(limit);
        return response?.data || [];
    }, [limit]);

    const { data: posts, loading, error, refetch } = useFetch(fetchRecent);

    if (loading) return <SidebarWidgetSkeleton />;

    if (error) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Recent Posts</h3>
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

    if (!posts || posts.length === 0) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Recent Posts</h3>
                <p className="text-muted small mb-0">No recent posts available.</p>
            </div>
        );
    }

    return (
        <div className="sidebar-widget">
            <h3 className="sidebar-widget-title">
                <i className="bi bi-clock-history me-2" aria-hidden="true" />
                Recent Posts
            </h3>
            <ul className="sidebar-post-list list-unstyled mb-0">
                {posts.map((post) => (
                    <li key={post.id} className="sidebar-post-item">
                        <Link to={`/post/${post.slug}`} className="sidebar-post-link">
                            <LazyImage
                                src={post.featured_image}
                                alt={post.title}
                                className="sidebar-post-thumb"
                                wrapperClassName="sidebar-post-thumb-wrapper"
                                fallbackType="post"
                            />
                            <div className="sidebar-post-info">
                                <span className="sidebar-post-title">{post.title}</span>
                                {post.published_at && (
                                    <span className="sidebar-post-meta">
                                        {formatDate(post.published_at)}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
