/**
 * Get fallback images for different components
 * @param {string} type - 'slider' | 'avatar' | 'post'
 * @returns {string} - Unsplash image URL
 */
export const getFallbackImage = (type = "post") => {
    if (type === "slider") {
        return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&h=600&q=80";
    }
    if (type === "avatar") {
        return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
    }
    return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=500&q=80";
};

/**
 * Format ISO date string into human readable format (e.g. "Jul 11, 2026")
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/**
 * Calculate reading time of a given article content
 * @param {string} content 
 * @returns {string} - e.g. "3 min read"
 */
export const calculateReadingTime = (content) => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    // Strip HTML tags to count words accurately
    const text = content.replace(/<\/?[^>]+(>|$)/g, "");
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
};

/**
 * Extract paginated list from Laravel API resource response
 * @param {Object} response
 * @returns {{ data: Array, meta: Object, links: Object }}
 */
export const extractPaginatedData = (response) => ({
    data: response?.data || [],
    meta: response?.meta || {},
    links: response?.links || {},
});

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}…`;
};

/**
 * Format view count for display (e.g. 1.2K)
 * @param {number} views
 * @returns {string}
 */
export const formatViews = (views) => {
    const count = Number(views) || 0;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return String(count);
};

/**
 * Category icon mapping based on slug/name keywords
 * @param {string} name
 * @returns {string} Bootstrap icon class
 */
export const getCategoryIcon = (name = "") => {
    const slug = name.toLowerCase();
    const iconMap = [
        { keywords: ["tech", "code", "dev", "program"], icon: "bi-code-slash" },
        { keywords: ["design", "ui", "ux", "creative"], icon: "bi-palette" },
        { keywords: ["business", "finance", "market"], icon: "bi-briefcase" },
        { keywords: ["health", "fitness", "wellness"], icon: "bi-heart-pulse" },
        { keywords: ["travel", "adventure"], icon: "bi-airplane" },
        { keywords: ["food", "recipe", "cook"], icon: "bi-cup-hot" },
        { keywords: ["news", "politic", "world"], icon: "bi-globe2" },
        { keywords: ["photo", "image", "camera"], icon: "bi-camera" },
        { keywords: ["music", "audio"], icon: "bi-music-note-beamed" },
        { keywords: ["sport", "game"], icon: "bi-trophy" },
        { keywords: ["education", "learn", "study"], icon: "bi-book" },
        { keywords: ["lifestyle", "life"], icon: "bi-stars" },
    ];

    const match = iconMap.find(({ keywords }) =>
        keywords.some((keyword) => slug.includes(keyword))
    );

    return match?.icon || "bi-folder2-open";
};
