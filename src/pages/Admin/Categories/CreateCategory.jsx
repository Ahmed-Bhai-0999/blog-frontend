import api from "../../../services/api";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { createCategory } from "../../../services/categoryService";

export default function CreateCategory() {

    const navigate = useNavigate();
    const [statuses, setStatuses] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Active",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const loadStatuses = async () => {
        try {
            const res = await api.get("/category-statuses");
            setStatuses(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadStatuses();
    }, []);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const res = await createCategory(formData);
            toast.success(res.data.message);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: res.data.message,
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/admin/categories");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                toast.error(err.response?.data?.message || "Something went wrong");
            }
        }
    };

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between">
                <h4>Create Category</h4>
                <Link to="/admin/categories" className="btn btn-secondary" >
                    Back
                </Link>
            </div>

            <div className="card-body">

                <form onSubmit={submitForm}>
                    <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name}
                            onChange={handleChange} />
                        {errors.name && (
                            <small className="text-danger">{errors.name[0]}</small>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea rows="5" name="description" className="form-control"
                            value={formData.description} onChange={handleChange} />

                        {errors.description && (
                            <small className="text-danger">{errors.description[0]}</small>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select name="status" className="form-select" value={formData.status}
                            onChange={handleChange} >

                            {statuses.map(status => (
                                <option key={status} value={status} > {status} </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-primary" type="submit" >
                        Save Category
                    </button>
                </form>
            </div>
        </div>
    );

}