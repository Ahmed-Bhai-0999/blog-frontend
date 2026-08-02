import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getTrashMenus, restoreMenu, forceDeleteMenu } from "../../../services/menuService";

export default function TrashMenus() {

    const [menus, setMenus] = useState([]);

    useEffect(() => {
        loadTrash();
    }, []);

    const loadTrash = async () => {
        try {
            const res = await getTrashMenus();
            setMenus(res.data.menu);
        } catch (err) {
            console.log(err);
        }
    };

    const handleRestore = async (id) => {
        const confirm = await Swal.fire({
            title: "Restore Menu?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Restore",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await restoreMenu(id);
            toast.success(res.data.message);
            loadTrash();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleForceDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Permanent Delete?",
            text: "This cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete Forever",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await forceDeleteMenu(id);
            toast.success(res.data.message);
            loadTrash();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    return (

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header d-flex justify-content-between">
                    <h4>Trash Menus</h4>

                    <Link to="/admin/menus" className="btn btn-secondary" >
                        Back
                    </Link>
                </div>

                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th width="220">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.length > 0 ? (
                                menus.map((menu, index) => (
                                    <tr key={menu.id}>
                                        <td>{index + 1}</td>
                                        <td>{menu.name}</td>
                                        <td>{menu.location}</td>
                                        <td>{menu.status}</td>
                                        <td>
                                            <button className="btn btn-success btn-sm me-2"
                                                onClick={() => handleRestore(menu.id)} >
                                                Restore
                                            </button>

                                            <button className="btn btn-danger btn-sm"
                                                onClick={() => handleForceDelete(menu.id)} >
                                                Delete Forever
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center" >
                                        No Deleted Menus
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    );

}