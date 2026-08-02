import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getPopularPosts } from "../../services/postService";
import useFetch from "../../hooks/useFetch";
import LazyImage from "../common/LazyImage";
import { formatViews } from "../../utils/helpers";
import { SidebarWidgetSkeleton } from "../common/SkeletonLoader";

export default function PopularPostsWidget({ limit = 5 }) {
    const fetchPopular = useCallback(async () => {
        const response = await getPopularPosts(limit);
        return response?.data || [];
    }, [limit]);

    const { data: posts, loading, error, refetch } = useFetch(fetchPopular);

    if (loading) return <SidebarWidgetSkeleton />;

    if (error) {
        return (
            <div className="sidebar-widget">
                <h3 className="sidebar-widget-title">Popular Posts</h3>
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
                <h3 className="sidebar-widget-title">Popular Posts</h3>
                <p className="text-muted small mb-0">No popular posts yet.</p>
            </div>
        );
    }

    return (
        <div className="sidebar-widget">
            <h3 className="sidebar-widget-title">
                <i className="bi bi-fire me-2" aria-hidden="true" />
                Popular Posts
            </h3>
            <ul className="sidebar-post-list list-unstyled mb-0">
                {posts.map((post, index) => (
                    <li key={post.id} className="sidebar-post-item">
                        <Link to={`/post/${post.slug}`} className="sidebar-post-link">
                            <span className="sidebar-post-rank">{index + 1}</span>
                            <LazyImage
                                src={post.featured_image}
                                alt={post.title}
                                className="sidebar-post-thumb"
                                wrapperClassName="sidebar-post-thumb-wrapper"
                                fallbackType="post"
                            />
                            <div className="sidebar-post-info">
                                <span className="sidebar-post-title">{post.title}</span>
                                <span className="sidebar-post-meta">
                                    <i className="bi bi-eye me-1" aria-hidden="true" />
                                    {formatViews(post.views)} views
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
