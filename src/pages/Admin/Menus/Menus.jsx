import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import Pagination from "../../../components/common/Pagination";

import { getMenus, deleteMenu, changeMenuStatus } from "../../../services/menuService";

export default function Menus() {

    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    useEffect(() => {
        loadMenus();
    }, []);

    useEffect(() => {
        loadMenus(1);
    }, [search, status]);

    const loadMenus = async (page = 1) => {
        setLoading(true);

        try {
            const res = await getMenus({page, search, status});
            // console.log(res);
            setMenus(res.data);
            setPagination({
                current_page: res.meta.current_page,
                last_page: res.meta.last_page,
                per_page: res.meta.per_page,
                total: res.meta.total,
            });
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete Menu?",
            text: "You can restore it later.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await deleteMenu(id);
            toast.success(res.data.message);
            loadMenus(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const openStatusModal = async (menu) => {
        const { value: status } = await Swal.fire({
            title: "Change Status",
            input: "select",
            inputOptions: {
                Active: "Active",
                Inactive: "Inactive",
            },
            inputValue: menu.status,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (!status) return;

        try {
            const res = await changeMenuStatus(menu.id, status);
            toast.success(res.data.message);
            loadMenus(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    return (

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="mb-0">
                            Menus
                            <span className="badge bg-primary ms-2">
                                {pagination.total}
                            </span>
                        </h4>
                    </div>
                        <div className="d-flex gap-2">
                            <Link to="/admin/menus/create" className="btn btn-primary btn-sm" >
                                Add Menu
                            </Link>
                            <Link to="/admin/menus/trash" className="btn btn-danger btn-sm" >
                                Trash
                            </Link>
                        </div>
                    
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input className="form-control" placeholder="Search Menu..." value={search}
                                onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="col-md-6"></div>
                        <div className="col-md-2">
                            <select className="form-select" value={status}
                                onChange={(e) => setStatus(e.target.value)} >

                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <table className="table table-bordered align-middle table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Items</th>
                                <th>Created By</th>
                                <th>Updated By</th>
                                <th>Created</th>
                                <th width="260">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center" >
                                        Loading...
                                    </td>
                                </tr>
                            ) : menus.length > 0 ? (
                                menus.map((menu, index) => (
                                    <tr key={menu.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <strong>{menu.name}</strong>
                                        </td>
                                        <td>
                                            <span className="badge bg-info">
                                                {menu.location}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    menu.status === "Active" ? "bg-success" : "bg-danger"
                                                }`}
                                            >
                                                {menu.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary">
                                                {menu.items?.length ?? 0}
                                            </span>
                                        </td>
                                        <td>
                                            {menu.created_by ?? "-"}
                                        </td>
                                        <td>
                                            {menu.updated_by ?? "-"}
                                        </td>
                                        <td>
                                            {new Date(menu.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <Link to={`/admin/menus/edit/${menu.id}`} className="btn btn-warning btn-sm me-2" >
                                                Edit
                                            </Link>

                                            <button className="btn btn-success btn-sm me-2"
                                                onClick={() => openStatusModal(menu)}  >
                                                Status
                                            </button>

                                            <button className="btn btn-danger btn-sm" 
                                                onClick={() => handleDelete(menu.id)} >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center text-muted" >
                                        No Menus Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination pagination={pagination} onPageChange={loadMenus} />
                </div>
            </div>
        </div>

    );

}