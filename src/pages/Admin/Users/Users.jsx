import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getUsers, deleteUser, changeUserStatus } from "../../../services/userService";

export default function Users() {

    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        loadUsers();
    }, [search, page, statusFilter]);

    const loadUsers = async () => {
        try {
            const res = await getUsers({search, page, status: statusFilter});
            setUsers(res.data);
            setMeta(res.meta);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const removeUser = async (id) => {
        const result = await Swal.fire({
            title: "Delete User?",
            text: "You can restore it later.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteUser(id);
            toast.success(res.data.message);
            loadUsers();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const openStatusModal = async (user) => {
        const { value: status } = await Swal.fire({
            title: "Change Status",
            input: "select",
            inputOptions: {
                Active: "Active",
                Inactive: "Inactive",
            },
            inputValue: user.status,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (!status) return;

        try {
            const res = await changeUserStatus(user.id, status);
            toast.success(res.data.message);
            loadUsers();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) return <h4>Loading...</h4>;

    return (

        <div className="card shadow">

            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Users</h4>
                    <div>
                        <Link to="/admin/users/create" className="btn btn-primary" >
                            Add User
                        </Link>

                        <Link to="/admin/users/trash" className="btn btn-danger ms-2" >
                            Trash
                        </Link>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Search..." value={search}
                            onChange={(e) => {setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="col-md-6"></div>
                    <div className="col-md-2">
                        <select className="form-select" value={statusFilter} onChange={(e) => {
                                setStatusFilter(e.target.value); setPage(1); }} >

                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th width="220">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center"> No Record Found </td>
                            </tr>
                        )}

                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{(meta.from || 1) + index}</td>
                                <td>
                                    <img src={user.avatar ? user.avatar : "/images/default-avatar.png"}
                                        width="40" height="40" className="rounded-circle" alt="" />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.roles?.[0] ?? "-"}
                                </td>
                                <td>
                                    <span className={`badge ${
                                            user.status === "Active" ? "bg-success" : "bg-danger"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2"
                                        onClick={() => openStatusModal(user)}
                                    >
                                        Status
                                    </button>

                                    <Link to={`/admin/users/edit/${user.id}`} className="btn btn-warning btn-sm me-2" >
                                        Edit
                                    </Link>

                                    <button className="btn btn-danger btn-sm" onClick={() => removeUser(user.id)} >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );

}