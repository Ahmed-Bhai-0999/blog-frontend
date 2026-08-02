import api from "../../../services/api";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getTag, updateTag } from "../../../services/tagService";

export default function EditTag() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [statuses, setStatuses] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        status: "Active",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const loadStatuses = async () => {
        try {
            const res = await api.get("/tag-statuses");
            setStatuses(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadTags = async () => {
        try {
            const tag = await getTag(id);
            setFormData({
                name: tag.name || "",
                status: tag.status || "Active",
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadTags();
        loadStatuses();
    }, []);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const res = await updateTag(id, formData);
            toast.success(res.message);
            Swal.fire({
                icon: "success",
                title: "Updated",
                text: res.message,
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/admin/tags");
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
                <h4>Update Tags</h4>
                <Link to="/admin/tags" className="btn btn-secondary" >
                    Back
                </Link>
            </div>

            <div className="card-body">

                <form onSubmit={submitForm}>
                    <div className="mb-3">
                        <label className="form-label">Tag Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name}
                            onChange={handleChange} />
                        {errors.name && (
                            <small className="text-danger">{errors.name[0]}</small>
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

                    <button className="btn btn-primary" type="submit" >Update Tag</button>
                </form>
            </div>
        </div>
    );

}