import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../../services/api";
import { createSlider, getSlider, updateSlider } from "../../../services/sliderService";

export default function SliderForm({ isEdit = false }) {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [preview, setPreview] = useState("");
    const [statuses, setStatuses] = useState([]);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        description: "",
        button_text: "",
        button_url: "",
        sort_order: 0,
        status: "Active",
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm(prev => ({...prev, image: file}));
        setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        if (!isEdit) return;
        loadSlider();
    }, []);

    useEffect(() => {
        loadStatuses();
    }, []);

    const loadSlider = async () => {
        try {
            const res = await getSlider(id);
            console.log(res);
            const slider = res.data.data;
            console.log(slider);

            setForm({
                title: slider.title ?? "",
                subtitle: slider.subtitle ?? "",
                description: slider.description ?? "",
                button_text: slider.button_text ?? "",
                button_url: slider.button_url ?? "",
                sort_order: slider.sort_order ?? 0,
                status: slider.status ?? "Active",
                image: null,
            });
            setPreview(slider.image);
        } catch (err) {
            console.log(err);
        }
    };

    const loadStatuses = async () => {
        try {
            const res = await api.get("/slider-statuses");
            setStatuses(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const data = new FormData();
            Object.keys(form).forEach((key) => {
                data.append(key, form[key]);
            });
            let res;
            if (isEdit) {
                res = await updateSlider(id, data);
            } else {
                res = await createSlider(data);
            }
            toast.success(res.data.message);
            navigate("/admin/sliders");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                toast.error(
                    err.response?.data?.message || "Something went wrong."
                );
            }

        } finally {
            setLoading(false);
        }
    };
    
    return (

        <div className="card shadow-sm">
            <div className="card-header">
                <h4>{isEdit ? "Edit Slider" : "Create Slider"} </h4>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Title <span className="text-danger">*</span>
                            </label>
                            <input type="text" name="title" className="form-control"
                                value={form.title} onChange={handleChange} />

                            {errors.title && (
                                <small className="text-danger">{errors.title[0]}</small>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Subtitle</label>
                            <input type="text" name="subtitle" className="form-control"
                                value={form.subtitle || ""} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea rows="4" className="form-control" name="description"
                            value={form.description || ""} onChange={handleChange} />
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Button Text</label>
                            <input className="form-control" name="button_text"
                                value={form.button_text || ""} onChange={handleChange} />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label">Button URL</label>
                            <input className="form-control" name="button_url"
                                value={form.button_url || ""} onChange={handleChange} />
                        </div>
                    
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Sort Order</label>
                            <input type="number" className="form-control" name="sort_order"
                                value={form.sort_order || 0} onChange={handleChange} />
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-md-5 mb-3">
                            <label className="form-label">Status</label>
                            <select className="form-select" name="status" value={form.status || "Active"}
                                onChange={handleChange} >
                            
                                {statuses.map(status => (
                                    <option key={status} value={status} > {status} </option>
                                ))}
                            </select>
                        </div>
                    

                        <div className="col-md-5 mb-3">
                            <label className="form-label">Slider Image</label>
                            <input type="file" className="form-control" accept="image/*"
                                onChange={handleImage} />

                            {errors.image && (
                                <small className="text-danger">{errors.image[0]}</small>
                            )}
                        </div>

                        {preview && (
                            <div className="col-md-2 mb-3">
                                <img  src={preview} alt="Preview" className="img-thumbnail"
                                    style={{width: 130, borderRadius: 10}}
                                />
                            </div>
                        )} 

                    </div>


                    <div className="text-end">
                        <button className="btn btn-primary" disabled={loading} >
                            {loading ? "Saving..." : isEdit ? "Update Slider" : "Create Slider"}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
