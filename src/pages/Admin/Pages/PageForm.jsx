import api from "../../../services/api";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { createPage, updatePage, editPage } from "../../../services/pageService";

export default function PageForm({ isEdit = false }) {

    const navigate = useNavigate();
    const { id } = useParams();

    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});
    const [statuses, setStatuses] = useState([]);

    const [form, setForm] = useState({
        title: "",
        content: "",
        template: "Default",
        status: "Draft",
        published_at: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        image: null,
    });

    useEffect(() => {
        loadStatuses();

        if (isEdit) {
            loadPage();
        }
    }, []);

    const loadStatuses = async () => {
        try {
            const res = await api.get("/page-statuses");
            setStatuses(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadPage = async () => {
        try {
            const res = await editPage(id);
            const page = res.data.data;
            setForm({
                title: page.title || "",
                content: page.content || "",
                template: page.template || "Default",
                status: page.status || "Draft",
                published_at: page.published_at || "",
                meta_title: page.meta_title || "",
                meta_description: page.meta_description || "",
                meta_keywords: page.meta_keywords || "",
                image: null,
            });
            setImagePreview(page.image);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((prev) => ({...prev, image: file}));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(form).forEach((key) => {
            data.append(key, form[key]);
        });

        try {
            let res;
            if (isEdit) {
                res = await updatePage(id, data);
            } else {
                res = await createPage(data);
            }

            toast.success(res.data.message);
            navigate("/admin/pages");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            }
            toast.error(err.response?.data?.message);
        }
        setLoading(false);
    };

    return (
        <div className="col-lg-12 mb-4">
            <div className="card shadow-sm h-100">
                <div className="card-header">
                    <h5 className="mb-0">General Information</h5>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                                {/* Title */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Page Title</label>
                                <input type="text" name="title" className="form-control"
                                    value={form.title} onChange={handleChange} />

                                {errors.title &&
                                    <small className="text-danger">{errors.title[0]}</small>
                                }
                            </div>

                            {/* Template */}
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label>Template</label>
                                    <select className="form-select" name="template" value={form.template}
                                    onChange={handleChange} >

                                    <option value="Default">Default</option>
                                    <option value="Full-Width">Full Width</option>
                                    <option value="Contact">Contact</option>
                                    <option value="Landing">Landing</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div className="col-md-4 mb-3">
                                    <label>Status</label>
                                    <select className="form-select" name="status" value={form.status}
                                        onChange={handleChange} >

                                        {statuses.map(status => (
                                            <option key={status} value={status} > {status} </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Publish Date */}
                                <div className="col-md-4 mb-3">
                                    <label>Publish Date</label>
                                    <input type="datetime-local" className="form-control" name="published_at"
                                        value={form.published_at} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-4">
                                    <div className="card shadow-sm">
                                        <div className="card-header">
                                        <h5 className="mb-0">Featured Image</h5>
                                        </div>

                                        <div className="card-body">
                                        <input type="file" className="form-control" accept="image/*"
                                            onChange={handleImage} />

                                            <div className="text-center mt-4">
                                                {imagePreview 
                                                    ? <img src={imagePreview} alt="Preview" className="img-thumbnail shadow"
                                                        style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }} />
                                                    : <div className="border rounded d-flex justify-content-center align-items-center"
                                                            style={{height: 250}} >
                                                        No Image
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        
                                <div className="col-md-8 mb-4">
                                    <div className="card shadow-sm">
                                        <div className="card-header">
                                            <h5 className="mb-0">SEO Settings</h5>
                                        </div>

                                        <div className="card-body">
                                            <div className="mb-2">
                                                <label className="form-label">Meta Title</label>
                                                <input type="text" className="form-control" name="meta_title"
                                                    value={form.meta_title} onChange={handleChange} />

                                                {errors.meta_title &&
                                                    <small className="text-danger">{errors.meta_title[0]}</small>
                                                }
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Meta Description</label>
                                                <textarea rows="4" className="form-control" name="meta_description"
                                                    value={form.meta_description} onChange={handleChange} />

                                                {errors.meta_description &&
                                                    <small className="text-danger">{errors.meta_description[0]}</small>
                                                }
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Meta Keywords</label>
                                                <input type="text" className="form-control" name="meta_keywords"
                                                    placeholder=" blog, post, etc" value={form.meta_keywords}
                                                    onChange={handleChange} />

                                                {errors.meta_keywords &&
                                                    <small className="text-danger">{errors.meta_keywords[0]}</small>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-header">
                                        <h5 className="mb-0">Page Content</h5>
                                    </div>

                                    <div className="card-body">
                                        <CKEditor editor={ClassicEditor} data={form.content}
                                            onChange={(event, editor)=>{setForm(prev=>({
                                                    ...prev,content:editor.getData()
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="text-end mt-4">
                                <button className="btn btn-primary px-5" disabled={loading} >
                                    {loading ? "Saving..." : isEdit
                                            ? "Update Page" : "Create Page"
                                    }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}