import { useState } from "react";
import { login } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [form, setForm] = useState({ email: "", password: "", remember: false, });

    const submit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(form);
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            navigate("/admin/dashboard");
        } catch (err) {
            alert(err.message);
        }
    };

    return (

        <div className="container py-5">
            <div className="col-lg-4 mx-auto">
                <div className="card shadow">
                    <div className="card-body">
                        <h3 className="mb-4">Admin Login </h3>

                        <form onSubmit={submit}>
                            <input className="form-control mb-3" placeholder="Email" value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value, }) } />

                            <input type="password" className="form-control mb-3" placeholder="Password" value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value, }) } />

                            <div className="form-check mb-3">
                                <input id="remember" type="checkbox" className="form-check-input" checked={form.remember}
                                    onChange={(e) => setForm({...form, remember: e.target.checked, }) } />
                                
                                <label htmlFor="remember" className="form-check-label">
                                    Remember Me
                                </label>
                            </div>

                            <button className="btn btn-primary w-100"> Login </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}