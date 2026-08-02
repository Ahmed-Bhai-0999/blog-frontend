import { useCallback } from "react";
import { getSliders } from "../../services/sliderService";
import useFetch from "../../hooks/useFetch";
import LazyImage from "../common/LazyImage";
import { SliderSkeleton } from "../common/SkeletonLoader";

export default function HeroSlider() {
    const fetchSliders = useCallback(async () => {
        const response = await getSliders({ status: "Active", per_page: 10 });
        return response?.data || [];
    }, []);

    const { data: sliders, loading, error, refetch } = useFetch(fetchSliders);

    if (loading) {
        return <SliderSkeleton />;
    }

    if (error) {
        return (
            <div className="hero-slider-error container py-5">
                <div className="alert alert-danger d-flex align-items-center justify-content-between mb-0">
                    <span>
                        <i className="bi bi-exclamation-triangle me-2" aria-hidden="true" />
                        {error}
                    </span>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={refetch}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!sliders || sliders.length === 0) {
        return null;
    }

    return (
        <section className="hero-slider-section" aria-label="Featured highlights">
            <div
                id="heroSlider"
                className="carousel slide carousel-fade hero-carousel"
                data-bs-ride="carousel"
                data-bs-interval="6000"
                data-bs-pause="hover"
            >
                {/* Indicators */}
                <div className="carousel-indicators hero-carousel-indicators">
                    {sliders.map((slider, index) => (
                        <button
                            key={slider.id}
                            type="button"
                            data-bs-target="#heroSlider"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : undefined}
                            aria-label={`Slide ${index + 1}: ${slider.title}`}
                        />
                    ))}
                </div>

                {/* Slides */}
                <div className="carousel-inner">
                    {sliders.map((slider, index) => (
                        <div
                            key={slider.id}
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                            <div className="hero-slide">
                                <LazyImage
                                    src={slider.image}
                                    alt={slider.title || "Slider image"}
                                    className="hero-slide-img"
                                    fallbackType="slider"
                                    wrapperClassName="hero-slide-image-wrapper"
                                />
                                <div className="hero-slide-overlay" />
                                <div className="carousel-caption hero-slide-caption">
                                    <div className="container">
                                        <div className="hero-slide-content">
                                            {slider.subtitle && (
                                                <span className="hero-slide-subtitle">
                                                    {slider.subtitle}
                                                </span>
                                            )}
                                            {slider.title && (
                                                <h2 className="hero-slide-title font-editorial">
                                                    {slider.title}
                                                </h2>
                                            )}
                                            {slider.description && (
                                                <p className="hero-slide-description">
                                                    {slider.description}
                                                </p>
                                            )}
                                            {slider.button_text && slider.button_url && (
                                                <a
                                                    href={slider.button_url}
                                                    className="btn btn-premium btn-lg hero-slide-btn"
                                                    target={
                                                        slider.button_url.startsWith("http")
                                                            ? "_blank"
                                                            : undefined
                                                    }
                                                    rel={
                                                        slider.button_url.startsWith("http")
                                                            ? "noopener noreferrer"
                                                            : undefined
                                                    }
                                                >
                                                    {slider.button_text}
                                                    <i
                                                        className="bi bi-arrow-right ms-2"
                                                        aria-hidden="true"
                                                    />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                {sliders.length > 1 && (
                    <>
                        <button
                            className="carousel-control-prev hero-carousel-control"
                            type="button"
                            data-bs-target="#heroSlider"
                            data-bs-slide="prev"
                            aria-label="Previous slide"
                        >
                            <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                            />
                        </button>
                        <button
                            className="carousel-control-next hero-carousel-control"
                            type="button"
                            data-bs-target="#heroSlider"
                            data-bs-slide="next"
                            aria-label="Next slide"
                        >
                            <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                            />
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}
