import api from "../../../services/api";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getCategory, updateCategory } from "../../../services/categoryService";

export default function EditCategory() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [statuses, setStatuses] = useState([]);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "", description: "", status: "Active",
    });

    useEffect(() => {
        loadCategory();
        loadStatuses();
    }, []);

    const loadStatuses = async () => {
        try {
            const res = await api.get("/category-statuses");
            setStatuses(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadCategory = async () => {
        try {
            const category = await getCategory(id);
            setFormData({
                name: category.name || "",
                description: category.description || "",
                status: category.status || "Active",
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const res = await updateCategory(id, formData);
            toast.success(res.message);
            Swal.fire({
                icon: "success",
                title: "Updated",
                text: res.message,
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/admin/categories");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                toast.error(
                    err.response?.data?.message || "Something went wrong."
                );
            }
        }

    };

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between">
                <h4>Edit Category</h4>
                <Link to="/admin/categories" className="btn btn-secondary" >Back</Link>
            </div>

            <div className="card-body">
                <form onSubmit={submitForm}>
                    <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input type="text" name="name" className="form-control"
                            value={formData.name} onChange={handleChange} />

                        {errors.name && (
                            <small className="text-danger">{errors.name[0]}</small>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea rows="5" name="description" className="form-control"
                            value={formData.description} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select name="status" className="form-select" value={formData.status}
                            onChange={handleChange} >

                            {statuses.map((status) => (
                                <option key={status} value={status} >{status}</option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-primary" type="submit" >Update Category</button>
                </form>
            </div>
        </div>

    );

}