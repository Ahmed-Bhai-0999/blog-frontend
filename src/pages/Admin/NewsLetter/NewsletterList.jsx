import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import Pagination from "../../../components/common/Pagination";

import { getNewsletters, deleteNewsletter, changeNewsletterStatus } from "../../../services/newsletterService";

export default function NewsletterList() {

    const [loading, setLoading] = useState(false);
    const [newsletters, setNewsletters] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [sort, setSort] = useState("latest");
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
    });

    useEffect(() => {
        loadNewsletters();
    }, []);

    useEffect(() => {
        loadNewsletters(1);
    }, [search, status, sort]);

    const loadNewsletters = async (page = 1) => {
        setLoading(true);

        try {
            const res = await getNewsletters({page,search,status,sort});
            setNewsletters(res.data.data);
            setPagination(res.data.meta);
        } catch (err) {
            console.log(err);
            toast.error("Unable to load subscribers.");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete Subscriber?",
            text: "Subscriber will be moved to trash.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await deleteNewsletter(id);
            toast.success(res.data.message);
            loadNewsletters(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleStatus = async (id) => {
        try {
            const res = await changeNewsletterStatus(id);
            toast.success(res.data.message);
            loadNewsletters(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    return (

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>Newsletter Subscribers
                        <span className="badge bg-primary ms-2">
                            {pagination.total}
                        </span>
                    </h4>
                    <Link to="/admin/newsletters/trash" className="btn btn-danger" >
                        Trash
                    </Link>
                </div>

                <div className="card-body">
                    {/* Filters */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="Search Email..."
                                value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="col-md-4"></div>

                        <div className="col-md-2">
                            <select className="form-select" value={status}
                                onChange={(e) => setStatus(e.target.value)} >

                                <option value="">All Status</option>
                                <option value="Subscribed">Subscribed</option>
                                <option value="Unsubscribed">Unsubscribed</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} >
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th width="60">#</th>
                                    <th>Email</th>
                                    <th width="150">Status</th>
                                    <th width="180">Subscribed At</th>
                                    <th width="150">Created By</th>
                                    <th width="180">Created</th>
                                    <th width="260">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="spinner-border text-primary"></div>
                                        </td>
                                    </tr>
                                ) : newsletters.length > 0 ? (
                                    newsletters.map((newsletter, index) => (
                                        <tr key={newsletter.id}>
                                            <td>
                                                {(pagination.current_page - 1) * pagination.per_page + index + 1}
                                            </td>
                                            <td>
                                                {newsletter.email}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        newsletter.status === "Subscribed" ? "bg-success" : "bg-danger"
                                                    }`} >
                                                    {newsletter.status}
                                                </span>
                                            </td>
                                            <td>
                                                {newsletter.subscribed_at
                                                    ? new Date(newsletter.subscribed_at).toLocaleString() : "--"
                                                }
                                            </td>
                                            <td>
                                                {newsletter.user?.name ?? "--"}
                                            </td>
                                            <td>
                                                {new Date(newsletter.created_at).toLocaleString()}
                                            </td>
                                            <td>
                                                <Link to={`/admin/newsletters/edit/${newsletter.id}`}
                                                    className="btn btn-primary btn-sm me-2" >
                                                    {/* <i className="fas fa-edit"></i> */}
                                                    Edit
                                                </Link>
                                                <button className={`btn btn-sm me-2 ${
                                                        newsletter.status === "Subscribed" ? "btn-warning" : "btn-success"
                                                    }`}
                                                    onClick={() =>handleStatus(newsletter.id)
                                                    }
                                                >
                                                    {newsletter.status === "Subscribed" ? "Unsubscribe" : "Subscribe"}
                                                </button>
                                                <button className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(newsletter.id)} >
                                                    {/* <i className="fas fa-trash"></i> */}
                                                    Trash
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5" >
                                            <img src="/images/no-data.svg" width="150" alt="" />
                                            <h5 className="mt-3">No Subscriber Found</h5>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination pagination={pagination} onPageChange={loadNewsletters} />
                </div>
            </div>

        </div>

    );

}