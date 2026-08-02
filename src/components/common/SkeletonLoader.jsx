/**
 * Skeleton loaders for Phase 2 home page sections.
 */

export function SliderSkeleton() {
    return (
        <div className="hero-slider-skeleton" aria-hidden="true">
            <div className="skeleton hero-slider-skeleton-image" />
            <div className="hero-slider-skeleton-content">
                <div className="skeleton skeleton-title mx-auto" />
                <div className="skeleton skeleton-text mx-auto w-50" />
                <div className="skeleton skeleton-text mx-auto w-75" />
            </div>
        </div>
    );
}

export function PostCardSkeleton({ variant = "default" }) {
    if (variant === "featured") {
        return (
            <div className="premium-card featured-post-card-skeleton" aria-hidden="true">
                <div className="skeleton skeleton-image featured-skeleton-image" />
                <div className="p-4">
                    <div className="skeleton skeleton-text w-25 mb-3" />
                    <div className="skeleton skeleton-title mb-3" />
                    <div className="skeleton skeleton-text mb-2" />
                    <div className="skeleton skeleton-text w-75 mb-4" />
                    <div className="skeleton skeleton-text w-50" />
                </div>
            </div>
        );
    }

    return (
        <div className="premium-card post-card-skeleton" aria-hidden="true">
            <div className="skeleton skeleton-image" />
            <div className="p-3">
                <div className="skeleton skeleton-text w-25 mb-2" />
                <div className="skeleton skeleton-title mb-2" />
                <div className="skeleton skeleton-text mb-1" />
                <div className="skeleton skeleton-text w-75" />
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="category-card category-card-skeleton" aria-hidden="true">
            <div className="skeleton category-icon-skeleton rounded-circle mb-3" />
            <div className="skeleton skeleton-title mx-auto mb-2" />
            <div className="skeleton skeleton-text w-50 mx-auto" />
        </div>
    );
}

export function SidebarWidgetSkeleton() {
    return (
        <div className="sidebar-widget sidebar-widget-skeleton" aria-hidden="true">
            <div className="skeleton skeleton-title mb-3" />
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="d-flex gap-3 mb-3">
                    <div className="skeleton sidebar-thumb-skeleton flex-shrink-0" />
                    <div className="flex-grow-1">
                        <div className="skeleton skeleton-text mb-2" />
                        <div className="skeleton skeleton-text w-50" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function PostGridSkeleton({ count = 6, variant = "default" }) {
    return (
        <div className="row g-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={variant === "featured" ? "col-md-6 col-lg-3" : "col-md-6 col-lg-4"}
                >
                    <PostCardSkeleton variant={variant} />
                </div>
            ))}
        </div>
    );
}
