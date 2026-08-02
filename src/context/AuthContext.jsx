import { createContext, useContext, useEffect, useState } from "react";
import { profile } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await profile();
            setUser(data.user);
        }catch {
            localStorage.removeItem("auth_token");
            setUser(null);
        }
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{user, setUser, loading, }} >
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);