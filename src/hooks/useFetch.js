import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Reusable hook for API data fetching with loading, error, and refetch support.
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} deps - Dependency array for refetching
 * @param {Object} options - { enabled: boolean, initialData: any }
 */
export default function useFetch(fetchFn, deps = [], options = {}) {
    const { enabled = true, initialData = null } = options;
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    const refetch = useCallback(async () => {
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            const result = await fetchFn();
            if (mountedRef.current) {
                setData(result);
            }
        } catch (err) {
            if (mountedRef.current) {
                setError(err.message || "Failed to load data. Please try again.");
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [fetchFn, enabled]);

    useEffect(() => {
        mountedRef.current = true;
        if (enabled) {
            refetch();
        } else {
            setLoading(false);
        }
        return () => {
            mountedRef.current = false;
        };
    }, [refetch, enabled, ...deps]);

    return { data, loading, error, refetch, setData };
}
