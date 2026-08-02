import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getUser, updateUser, getRoles, getStatuses } from "../../../services/userService";

function CreateUser() {
    const [roles, setRoles] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        avatar: null,
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        role: "",
        status: "Active",
    });

    useEffect(() => {
        loadRoles();
        loadStatuses();
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const user = await getUser(id);

            setFormData({
                avatar: null,
                name: user.name || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "",
                password_confirmation: "",
                role: user.roles?.length ? user.roles[0] : "",
                status: user.status,
            });
            setPreview(user.avatar || null);
        } catch (err) {
            toast.error("User not found");
            navigate("/admin/users");
        }
    };

    const loadRoles = async () => {
        const data = await getRoles();
        setRoles(data);
    };

    const loadStatuses = async () => {
        const data = await getStatuses();
        setStatuses(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;
        setFormData({...formData, avatar: file,});

        setPreview(URL.createObjectURL(file));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            const res = await updateUser(id, data);
            toast.success(res.data.message);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: res.data.message,
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/admin/users");
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
            <div className="card-header"> <h4>Edit User</h4> </div>
            <div className="card-body">
                <form onSubmit={submitForm} encType="multipart/form-data">
                    <div className="row">
                        
                        {/* Name */}
                        <div className="mb-3 col-md-4">
                            <label>Name</label>
                            <input type="text" name="name" className="form-control" value={formData.name} 
                                    onChange={handleChange} placeholder="Enter Name" />

                            {errors.name && (
                                <small className="text-danger">{errors.name[0]} </small>
                            )}
                        </div>

                        {/* Username */}
                        <div className="mb-3 col-md-4">
                            <label>Username</label>
                            <input type="text" name="username" className="form-control" value={formData.username} 
                                onChange={handleChange}  placeholder="Enter User Name" />

                            {errors.username && (
                                <small className="text-danger">{errors.username[0]}</small>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-3 col-md-4">
                            <label>Email</label>
                            <input type="email" name="email" className="form-control" value={formData.email}
                                onChange={handleChange} placeholder="Enter User Email" />

                            {errors.email && (
                                <small className="text-danger">{errors.email[0]}</small>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="mb-3 col-md-4">
                            <label>Phone</label>
                            <input type="number" name="phone" className="form-control" value={formData.phone}
                                onChange={handleChange} placeholder="Enter User Phone number" />

                            {errors.phone && (
                                <small className="text-danger">{errors.phone[0]}</small>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-3 col-md-4">
                            <label>Password</label>
                            <input type="password"
                                name="password" className="form-control" value={formData.password}
                                onChange={handleChange} placeholder="Leave blank to keep current password" />

                            {errors.password && (
                                <small className="text-danger">{errors.password[0]}</small>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-3 col-md-4">
                            <label>Confirm Password</label>
                            <input type="password" name="password_confirmation" className="form-control"
                                value={formData.password_confirmation} onChange={handleChange} 
                                placeholder="Enter Confirm Password / Leave blank to keep current password" />
                        </div>

                        {/* Avatar */}
                        <div className="mb-3 col-md-4">
                            <label className="">Avatar</label>
                            <input type="file" className="form-control" accept="image/*" onChange={handleImage} />

                            {preview && (
                                <img src={preview} alt="Preview" className="mt-2 rounded" width="120" />
                            )}
                            
                            {errors.avatar && (
                                <small className="text-danger">{errors.avatar[0]}</small>
                            )}
                        </div>

                        {/* Role */}
                        <div className="mb-3 col-md-4">
                            <label>Role</label>
                            <select name="role" className="form-select" value={formData.role}
                                onChange={handleChange} >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name} >{role.name}</option>
                                ))}
                            </select>

                            {errors.role && (
                                <small className="text-danger">{errors.role[0]}</small>
                            )}
                        </div>

                        {/* Status */}
                        <div className="mb-3 col-md-4">
                            <label>Status</label>
                            <select name="status" className="form-select" value={formData.status}
                                onChange={handleChange} >
                                {statuses.map(status => (
                                    <option key={status} value={status} >{status}</option>
                                ))}
                            </select>

                            {errors.status && (
                                <small className="text-danger"> {errors.status[0]}</small>
                            )}
                        </div>
                        <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                            <Link to="/admin/users" className="btn btn-secondary">Back</Link>
                            
                            <button type="submit" className="btn btn-primary">Update User</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;