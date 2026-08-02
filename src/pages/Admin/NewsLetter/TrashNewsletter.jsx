import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getTrashNewsletters, restoreNewsletter, forceDeleteNewsletter } from "../../../services/newsletterService";

export default function TrashNewsletter() {

    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrash();
    }, []);

    const loadTrash = async () => {
        try {
            const res = await getTrashNewsletters();
            setNewsletters(res.data.newsletter.data);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
        setLoading(false);
    };

    const restoreItem = async (id) => {
        if (!window.confirm("Restore this subscriber?")) return;

        try {
            const res = await restoreNewsletter(id);
            toast.success(res.data.message);
            loadTrash();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const forceDelete = async (id) => {
        if (!window.confirm("Delete permanently?")) return;

        try {
            const res = await forceDeleteNewsletter(id);
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
                    <h4>Deleted Newsletter Subscribers</h4>
                    <Link to="/admin/newsletters" className="btn btn-primary" >
                        Back
                    </Link>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Subscribed</th>
                                    <th>Deleted At</th>
                                    <th width="170">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : newsletters.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No Deleted Records
                                        </td>
                                    </tr>
                                ) : (
                                    newsletters.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.email}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        item.status === "Subscribed" ? "bg-success" : "bg-danger"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                {item.subscribed_at ? new Date(item.subscribed_at).toLocaleString() : "-"}
                                            </td>
                                            <td>
                                                {item.deleted_at ? new Date(item.deleted_at).toLocaleString() : "-"}
                                            </td>
                                            <td>
                                                <button className="btn btn-success btn-sm me-2"
                                                    onClick={() => restoreItem(item.id)} >
                                                    Restore
                                                </button>
                                                <button className="btn btn-danger btn-sm"
                                                    onClick={() => forceDelete(item.id)} >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

        </div>

    );

}