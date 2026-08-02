import { useCallback, useMemo } from "react";
import { getCategories } from "../../services/categoryService";
import { getPosts } from "../../services/postService";
import useFetch from "../../hooks/useFetch";
import CategoryCard from "../cards/CategoryCard";
import { CategoryCardSkeleton } from "../common/SkeletonLoader";

export default function CategoriesSection() {
    const fetchCategories = useCallback(async () => {
        const response = await getCategories({ status: "Active", per_page: 50 });
        return response?.data || [];
    }, []);

    const fetchPostsForCount = useCallback(async () => {
        const response = await getPosts({ status: "Published", per_page: 100 });
        return response?.data || [];
    }, []);

    const {
        data: categories,
        loading: categoriesLoading,
        error: categoriesError,
        refetch: refetchCategories,
    } = useFetch(fetchCategories);

    const {
        data: posts,
        loading: postsLoading,
        error: postsError,
        refetch: refetchPosts,
    } = useFetch(fetchPostsForCount);

    const loading = categoriesLoading || postsLoading;
    const error = categoriesError || postsError;
    
    const postCountMap = useMemo(() => {
        const counts = {};
        const postList = Array.isArray(posts) ? posts : posts?.data || [];

        postList.forEach((post) => {
            const catId = post.category?.id;
            if (catId) {
                counts[catId] = (counts[catId] || 0) + 1;
            }
        });
        return counts;
    }, [posts]);

    const refetch = () => {
        refetchCategories();
        refetchPosts();
    };

    if (loading) {
        return (
            <section className="categories-section py-5 bg-white">
                <div className="container">
                    <SectionHeader />
                    <div className="row g-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="col-6 col-md-4 col-lg-2">
                                <CategoryCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="categories-section py-5 bg-white">
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

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="categories-section py-5 bg-white">
            <div className="container">
                <SectionHeader />
                <div className="row g-4">
                    {categories.map((category) => (
                        <div key={category.id} className="col-6 col-md-4 col-lg-2">
                            <CategoryCard
                                category={category}
                                postsCount={postCountMap[category.id] || 0}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SectionHeader() {
    return (
        <div className="section-header text-center mb-5">
            <span className="section-label">Explore Topics</span>
            <h2 className="section-title mb-2">Browse Categories</h2>
            <p className="text-muted mb-0">
                Discover stories organized by the topics you care about
            </p>
        </div>
    );
}
