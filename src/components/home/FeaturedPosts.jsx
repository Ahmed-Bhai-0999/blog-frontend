import { useCallback } from "react";
import { getFeaturedPosts } from "../../services/postService";
import useFetch from "../../hooks/useFetch";
import FeaturedPostCard from "../cards/FeaturedPostCard";
import { PostGridSkeleton } from "../common/SkeletonLoader";

export default function FeaturedPosts() {
    const fetchFeatured = useCallback(async () => {
        const response = await getFeaturedPosts(4);
        return response?.data || [];
    }, []);

    const { data: posts, loading, error, refetch } = useFetch(fetchFeatured);

    if (loading) {
        return (
            <section className="featured-posts-section py-5">
                <div className="container">
                    <SectionHeader />
                    <PostGridSkeleton count={4} variant="featured" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="featured-posts-section py-5">
                <div className="container">
                    <SectionHeader />
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
                </div>
            </section>
        );
    }

    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <section className="featured-posts-section py-5">
            <div className="container">
                <SectionHeader />
                <div className="row g-4">
                    {posts.map((post) => (
                        <div key={post.id} className="col-sm-6 col-lg-3">
                            <FeaturedPostCard post={post} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SectionHeader() {
    return (
        <div className="section-header d-flex align-items-end justify-content-between mb-4">
            <div>
                <span className="section-label">Editor&apos;s Pick</span>
                <h2 className="section-title mb-0">Featured Posts</h2>
            </div>
        </div>
    );
}
