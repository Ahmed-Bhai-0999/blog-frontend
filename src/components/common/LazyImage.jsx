import { useState } from "react";
import { getFallbackImage } from "../../utils/helpers";

/**
 * Lazy-loaded image with skeleton placeholder and fallback on error.
 */
export default function LazyImage({
    src,
    alt = "",
    className = "",
    wrapperClassName = "",
    fallbackType = "post",
    aspectRatio = "",
}) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const imageSrc = !src || error ? getFallbackImage(fallbackType) : src;

    return (
        <div
            className={`lazy-image-wrapper ${aspectRatio} ${wrapperClassName}`.trim()}
        >
            {!loaded && (
                <div
                    className="skeleton skeleton-image lazy-image-skeleton"
                    aria-hidden="true"
                />
            )}
            <img
                src={imageSrc}
                alt={alt}
                className={`lazy-image ${loaded ? "lazy-image-visible" : ""} ${className}`.trim()}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => {
                    setError(true);
                    setLoaded(true);
                }}
            />
        </div>
    );
}
