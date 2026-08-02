import { createContext, useContext, useState, useEffect } from "react";
import { getSettings } from "../services/settingService";
import { getMenus } from "../services/menuService";

const BlogContext = createContext(null);

export function BlogProvider({ children }) {
    const [settings, setSettings] = useState(null);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadGlobalData();
    }, []);

    const loadGlobalData = async () => {
        try {
            setLoading(true);
            const [settingsRes, menusRes] = await Promise.all([
                getSettings(),
                getMenus()
            ]);

            // Settings can be a resource collection or direct object
            const settingData = settingsRes?.data || settingsRes;
            const menuData = menusRes?.data || menusRes || [];

            setSettings(settingData);
            setMenus(menuData);
        } catch (err) {
            console.error("Error loading global blog settings/menus:", err);
            setError(err.message || "Failed to load blog config.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BlogContext.Provider value={{ settings, menus, loading, error, refreshSettings: loadGlobalData }}>
            {children}
        </BlogContext.Provider>
    );
}

export function useBlog() {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error("useBlog must be used within a BlogProvider");
    }
    return context;
}
