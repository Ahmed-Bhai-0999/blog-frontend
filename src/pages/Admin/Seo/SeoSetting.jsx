import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getSeoSetting, deleteSeoSetting } from "../../../services/seoSettingService";
import Loader from "../../../components/common/Loader";

export default function SeoSettings() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [seo, setSeo] = useState(null);

    useEffect(() => {
        loadSeo();
    }, []);

    const loadSeo = async () => {
        setLoading(true);
        try {
            const res = await getSeoSetting();
            setSeo(res.data.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setSeo(null);
            } else {
                toast.error("Unable to load SEO Setting");
            }
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        const confirm = await Swal.fire({
            title: "Delete SEO Setting?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await deleteSeoSetting(seo.id);
            toast.success(res.data.message);
            setSeo(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete Failed");
        }
    };

    if (loading) {
        return <Loader />
    }

    return (

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">SEO Settings</h4>
                    {seo ? (
                        <div>
                            <Link to={`/admin/seo-settings/edit/${seo.id}`} className="btn btn-primary me-2" >
                                Edit
                            </Link>
                            <button className="btn btn-danger" onClick={handleDelete} >
                                Delete
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-success" onClick={() => navigate("/admin/seo-settings/create")} >
                            Create SEO Setting
                        </button>
                    )}
                </div>

                <div className="card-body">
                    {!seo ? (
                        <div className="text-center py-5">
                            <h5>No SEO Setting Found</h5>
                            <p className="text-muted">Create SEO configuration first.</p>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-md-6">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th width="220">Meta Title</th>
                                            <td>{seo.meta_title}</td>
                                        </tr>
                                        <tr>
                                            <th>Meta Description</th>
                                            <td>{seo.meta_description}</td>
                                        </tr>
                                        <tr>
                                            <th>Meta Keywords</th>
                                            <td>{seo.meta_keywords}</td>
                                        </tr>
                                        <tr>
                                            <th>Canonical URL</th>
                                            <td>
                                                <a href={seo.canonical_url} target="_blank" rel="noreferrer" >
                                                    {seo.canonical_url}
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Robots</th>
                                            <td>{seo.robots}</td>
                                        </tr>
                                        <tr>
                                            <th>OG Title</th>
                                            <td>{seo.og_title}</td>
                                        </tr>
                                        <tr>
                                            <th>OG Description</th>
                                            <td>{seo.og_description}</td>
                                        </tr>
                                        <tr>
                                            <th>Twitter Title</th>
                                            <td>{seo.twitter_title}</td>
                                        </tr>
                                        <tr>
                                            <th>Twitter Description</th>
                                            <td>{seo.twitter_description}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="col-md-6">
                                <div className="card mb-4">
                                    <div className="card-header">
                                        OG Image
                                    </div>

                                    <div className="card-body text-center">
                                        {seo.og_image ? (
                                            <img src={seo.og_image} alt="" className="img-fluid rounded"
                                                style={{maxHeight: 250,}} />
                                        ) : (
                                            <p className="text-muted">No Image</p>
                                        )}
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header">
                                        Twitter Image
                                    </div>

                                    <div className="card-body text-center">
                                        {seo.twitter_image ? (
                                            <img src={seo.twitter_image} alt="" className="img-fluid rounded"
                                                style={{maxHeight: 250,}} />
                                        ) : (
                                            <p className="text-muted">No Image</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <div className="card">
                                    <div className="card-header">
                                        Schema Markup
                                    </div>

                                    <div className="card-body">
                                        <pre className="bg-light p-3 rounded" style={{whiteSpace: "pre-wrap",}} >
                                            {seo.schema_markup}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}