import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Swal from "sweetalert2";

import { getPages, deletePage, changeStatus } from "../../../services/pageService";

export default function Pages() {

    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        loadPages();
    }, [search, status]);

    const loadPages = async () => {
        setLoading(true);
        try {
            const res = await getPages({search, status});
            // console.log("Axios Response:", res);
            // console.log("Response Data:", res.data);
            setPages(res.data.data);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleDelete = async(id)=>{
        try{
            const res = await deletePage(id);
            toast.success(res.data.message);
            loadPages();
        }catch(err){
            toast.error(err.response?.data?.message);
        }
    }

    const handleStatus = async(id,status)=>{
        try{
            await changeStatus(id,status);
            loadPages();
        }catch(err){
            toast.error("Unable to update status");
        }
    }

    const openStatusModal = async (page) => {
        const { value: status } = await Swal.fire({
            title: "Change Page Status",
            input: "select",
            inputOptions: {
                Draft: "Draft",
                Published: "Published",
                Scheduled: "Scheduled",
                Archived: "Archived",
            },
            inputValue: page.status,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (!status) return;

        try {
            const res = await changeStatus(page.id, status);
            toast.success(res.data.message);
            loadPages();
        } catch (err) {
            toast.error(err.response?.data?.message || "Status update failed");
        }
    };

    return(

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header d-flex justify-content-between">
                    <h4>Pages</h4>
                    <div>
                        <Link className="btn btn-primary" to="/admin/pages/create" >
                            Add Page
                        </Link>
                        <Link className="btn btn-danger" to="/admin/pages/trash" >
                            Trash
                        </Link>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input className="form-control" placeholder="Search..." value={search}
                                onChange={(e)=>setSearch(e.target.value)} />
                        </div>
                        <div className="col-md-6"></div>
                        <div className="col-md-2">
                            <select className="form-select" value={status}
                                onChange={(e)=>setStatus(e.target.value)} >
                                <option value="">All Status</option>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>  
                    </div>

                    <table className="table table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Template</th>
                                <th>Author</th>
                                <th>Created</th>
                                <th width="250">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : pages.length > 0 ? (
                                pages.map((page, index) => (
                                    <tr key={page.id}>
                                        <td>{index + 1}</td>

                                        <td>
                                            {page.image ? (
                                                <img src={page.image} alt={page.title} width="70" height="50"
                                                    className="rounded" style={{ objectFit: "cover" }} />
                                            ) : (
                                                "-"
                                            )}
                                        </td>

                                        <td>
                                            <strong>{page.title}</strong>
                                            <br />
                                            <small className="text-muted">{page.slug}</small>
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${
                                                        page.status === "Published"
                                                            ? "bg-success"
                                                            : page.status === "Draft"
                                                            ? "bg-warning text-dark"
                                                            : page.status === "Scheduled"
                                                            ? "bg-info text-dark"
                                                            : "bg-secondary"
                                                    }`}
                                            >
                                                {page.status}
                                            </span>
                                        </td>

                                        <td>{page.template}</td>

                                        <td>{page.author ?? "-"}</td>

                                        <td>
                                            {page.created_at
                                                ? new Date(page.created_at).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            <Link to={`/admin/pages/edit/${page.id}`} className="btn btn-warning btn-sm me-2" >
                                                Edit
                                            </Link>

                                            <button className="btn btn-success btn-sm me-2" onClick={() => openStatusModal(page)} >
                                                Status
                                            </button>

                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(page.id)} >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        No pages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}