import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { createSeoSetting, updateSeoSetting, getSeoById } from "../../../services/seoSettingService";

export default function SeoSettingForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = !!id;
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        canonical_url: "",
        robots: "",

        og_title: "",
        og_description: "",

        twitter_title: "",
        twitter_description: "",

        schema_markup: "",

        og_image: null,
        twitter_image: null,
    });

    const [preview, setPreview] = useState({og_image: "", twitter_image: ""});

    useEffect(() => {
        if (id) {
            loadSeoSetting();
        }
    }, [id]);

    const loadSeoSetting = async () => {
        setLoading(true);
        try {
            const res = await getSeoById(id);
            const seo = res.data.data;
            setForm(prev => ({
                ...prev,
                meta_title: seo.meta_title ?? "",
                meta_description: seo.meta_description ?? "",
                meta_keywords: seo.meta_keywords ?? "",
                canonical_url: seo.canonical_url ?? "",
                robots: seo.robots ?? "",
                og_title: seo.og_title ?? "",
                og_description: seo.og_description ?? "",
                twitter_title: seo.twitter_title ?? "",
                twitter_description: seo.twitter_description ?? "",
                schema_markup: seo.schema_markup ?? "",
            }));

            setPreview({
                og_image: seo.og_image || "",
                twitter_image: seo.twitter_image || "",
            });
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setForm({...form, [name]: files[0]});
            setPreview({...preview, [name]: URL.createObjectURL(files[0])});
        } else {
            setForm({...form, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach((key) => {
            if (form[key] !== null) {
                data.append(key, form[key]);
            }
        });

        try {
            if (isEdit) {
                const res = await updateSeoSetting(id, data);
                toast.success(res.data.message);
            } else {
                const res = await createSeoSetting(data);
                toast.success(res.data.message);
            }
            navigate("/admin/seo-settings");
        } catch (err) {
            if (err.response?.data?.errors) {
                Object.values(err.response.data.errors).forEach((item) => {
                    toast.error(item[0]);
                });
            } else {
                toast.error(err.response?.data?.message);
            }
        }
    };

    return (

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header">
                    <h4>{isEdit ? "Update SEO Setting" : "Create SEO Setting"}</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Meta Title</label>
                                <input type="text" className="form-control" name="meta_title"
                                    value={form.meta_title} onChange={handleChange} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Canonical URL</label>
                                <input type="url" className="form-control" name="canonical_url"
                                    value={form.canonical_url} onChange={handleChange} />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Meta Description</label>
                                <textarea rows="3" className="form-control" name="meta_description"
                                    value={form.meta_description} onChange={handleChange} />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Meta Keywords</label>
                                <textarea rows="2" className="form-control" name="meta_keywords"
                                    value={form.meta_keywords} onChange={handleChange} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>Robots</label>
                                <input type="text" className="form-control" name="robots"
                                    value={form.robots} onChange={handleChange} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>OG Title</label>
                                <input className="form-control" name="og_title" value={form.og_title}
                                    onChange={handleChange} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>Twitter Title</label>
                                <input className="form-control" name="twitter_title" value={form.twitter_title}
                                    onChange={handleChange} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>OG Description</label>
                                <textarea rows="2" className="form-control" name="og_description"
                                    value={form.og_description} onChange={handleChange} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Twitter Description</label>
                                <textarea rows="2" className="form-control" name="twitter_description"
                                    value={form.twitter_description} onChange={handleChange} />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Schema Markup</label>
                                <textarea rows="6" className="form-control" name="schema_markup"
                                    value={form.schema_markup} onChange={handleChange} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">OG Image</label>

                                <div className="border rounded p-3 d-flex align-items-center justify-content-between">
                                    <div className="flex-grow-1 me-3">
                                        <input type="file" className="form-control" name="og_image" onChange={handleChange} />
                                        <small className="text-muted">
                                            Recommended size: 1200 × 600 px
                                        </small>
                                    </div>

                                    <div>
                                        <img src={preview.og_image || "/no-image.png"} alt="Preview"
                                            style={{width: 90, height: 90, objectFit: "cover", borderRadius: 8,
                                                border: "1px solid #ddd" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Twitter Image</label>

                                <div className="border rounded p-3 d-flex align-items-center justify-content-between shadow-sm">
                                    <div className="flex-grow-1 me-3">
                                        <input type="file" className="form-control" name="twitter_image" onChange={handleChange} />
                                        <small className="text-muted">
                                            Recommended size: 1200 × 600 px
                                        </small>
                                    </div>

                                    <div>
                                        <img src={preview.twitter_image || "/no-image.png"} alt="Twitter Preview"
                                            style={{width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px",
                                                border: "1px solid #ddd", background: "#f8f9fa" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary" disabled={loading} >
                            {isEdit ? "Update SEO Setting" : "Save SEO Setting"}
                        </button>
                    </form>

                </div>

            </div>

        </div>

    );

}