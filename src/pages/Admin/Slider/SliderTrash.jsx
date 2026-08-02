import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { sliderTrash, restoreSlider, forceDeleteSlider } from "../../../services/sliderService";

export default function SliderTrash() {

    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
   
    useEffect(() => {
        loadData();
    }, [search]);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await sliderTrash({
                search,
                status,
            });
            setSliders(res.data.data ?? []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const restore = async (id) => {
        const result = await Swal.fire({
            title: "Restore Slider?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Restore",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await restoreSlider(id);
            toast.success(res.data.message);
            loadData();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong."
            );
        }
    };

    const forceDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Forever?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await forceDeleteSlider(id);
            toast.success(res.data.message);
            loadData();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong."
            );
        }
    };

    return (
        <div className="container-fluid">

            <div className="card shadow-sm">

                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0"> Deleted Sliders </h5>
                    <Link to="/admin/sliders" className="btn btn-dark" >
                        Back
                    </Link>
                </div>

                <div className="card-body p-1">
                    <div className="container">
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder="Search..."
                                    value={search} onChange={(e) => setSearch(e.target.value)} />
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

                        <div className="">
                            {loading ? (
                                <div className="text-center p-5">
                                    Loading...
                                </div>
                            ) : (
                                <table className="table table-bordered table-hover mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th width="60">#</th>
                                            <th width="120">Image</th>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Deleted At</th>
                                            <th width="180">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sliders.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4" >
                                                    No Deleted Sliders Found
                                                </td>
                                            </tr>
                                        )}

                                        {sliders.map((slider, index) => (
                                            <tr key={slider.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <img src={slider.image} alt="" width="100" className="rounded" />
                                                </td>
                                                <td>
                                                    <strong>{slider.title}</strong>
                                                    <br />
                                                    <small className="text-muted">{slider.subtitle}</small>
                                                </td>
                                                <td>
                                                    <span 
                                                        className={`badge bg-${
                                                            slider.status === "Active" ? "success" : "secondary"
                                                        }`}
                                                    >
                                                        {slider.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {slider.deleted_at ?? slider.updated_at}
                                                </td>
                                                <td>
                                                    <button className="btn btn-success btn-sm me-2"
                                                        onClick={() => restore(slider.id)}
                                                    >
                                                        Restore
                                                    </button>

                                                    <button className="btn btn-danger btn-sm"
                                                        onClick={() => forceDelete(slider.id)}
                                                    >
                                                        Delete Forever
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>
    );
}