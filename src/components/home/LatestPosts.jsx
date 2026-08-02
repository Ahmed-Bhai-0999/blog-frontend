import { useState, useCallback } from "react";
import { getPosts } from "../../services/postService";
import useFetch from "../../hooks/useFetch";
import PostCard from "../cards/PostCard";
import { PostGridSkeleton } from "../common/SkeletonLoader";
import { extractPaginatedData } from "../../utils/helpers";

const POSTS_PER_PAGE = 6;

export default function LatestPosts() {
    const [page, setPage] = useState(1);

    const fetchPosts = useCallback(async () => {
        const response = await getPosts({
            status: "Published",
            per_page: POSTS_PER_PAGE,
            page,
        });
        return extractPaginatedData(response);
    }, [page]);

    const { data, loading, error, refetch } = useFetch(fetchPosts, [page]);
    const posts = data?.data || [];
    const meta = data?.meta || {};

    const currentPage = meta.current_page || page;
    const lastPage = meta.last_page || 1;
    const total = meta.total || 0;

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= lastPage && newPage !== currentPage) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <section className="latest-posts-section">
            <div className="section-header mb-4">
                <span className="section-label">Fresh Stories</span>
                <h2 className="section-title mb-0">Latest Posts</h2>
                {total > 0 && (
                    <p className="text-muted small mt-1 mb-0">
                        Showing {posts.length} of {total} articles
                    </p>
                )}
            </div>

            {loading && <PostGridSkeleton count={POSTS_PER_PAGE} />}

            {!loading && error && (
                <div className="alert alert-danger d-flex align-items-center justify-content-between">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={refetch}
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && posts.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-journal-x fs-1 d-block mb-3" aria-hidden="true" />
                    <p className="mb-0">No posts published yet. Check back soon!</p>
                </div>
            )}

            {!loading && !error && posts.length > 0 && (
                <>
                    <div className="row g-4">
                        {posts.map((post) => (
                            <div key={post.id} className="col-md-6">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>

                    {lastPage > 1 && (
                        <nav
                            className="mt-5 d-flex justify-content-center"
                            aria-label="Latest posts pagination"
                        >
                            <ul className="pagination pagination-premium mb-0">
                                <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        aria-label="Previous page"
                                    >
                                        <i className="bi bi-chevron-left" aria-hidden="true" />
                                    </button>
                                </li>

                                {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                                    (pageNum) => (
                                        <li
                                            key={pageNum}
                                            className={`page-item ${pageNum === currentPage ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(pageNum)}
                                                aria-current={
                                                    pageNum === currentPage ? "page" : undefined
                                                }
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    )
                                )}

                                <li
                                    className={`page-item ${currentPage >= lastPage ? "disabled" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= lastPage}
                                        aria-label="Next page"
                                    >
                                        <i className="bi bi-chevron-right" aria-hidden="true" />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </section>
    );
}
