import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(config => {

    const guestToken = localStorage.getItem("guest_token");
    if (guestToken) {
        config.headers["X-Guest-Token"] = guestToken;
    }
    return config;

});

// Request Interceptor: Attach token if user is authenticated
api.interceptors.request.use( (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Response Interceptor: Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null;
        let errorMessage = "Something went wrong. Please try again later.";

        if (error.response && error.response.data) {
            errorMessage = error.response.data.message || errorMessage;
        }

        if (status === 401) {
            // Handle token expiration/unauthorized access
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            // Do not force reload, components can listen to auth state changes
        } else if (status === 403) {
            console.error("Access Forbidden: You do not have permission.");
        } else if (status === 404) {
            console.error("Resource Not Found.");
        } else if (status === 422) {
            // Validation errors are handled locally by components/forms
            return Promise.reject(error);
        } else if (status >= 500) {
            console.error("Internal Server Error:", errorMessage);
        }

        return Promise.reject({
            status,
            message: errorMessage,
            originalError: error
        });
    }
);

export default api;