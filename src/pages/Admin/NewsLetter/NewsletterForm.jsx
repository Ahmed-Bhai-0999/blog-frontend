import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    createNewsletter,
    updateNewsletter,
    getNewsletterById,
} from "../../../services/newsletterService";

export default function NewsletterForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({email: "", status: "Subscribed"});

    useEffect(() => {
        if (isEdit) {
            loadNewsletter();
        }
    }, []);

    const loadNewsletter = async () => {
        setLoading(true);

        try {
            const res = await getNewsletterById(id);
            const newsletter = res.data.data;
            setForm({
                email: newsletter.email || "",
                status: newsletter.status || "Subscribed",
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Unable to load data");
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                const res = await updateNewsletter(id, form);
                toast.success(res.data.message);
            } else {
                const res = await createNewsletter(form);
                toast.success(res.data.message);
            }
            navigate("/admin/newsletters");
        } catch (err) {
            if (err.response?.data?.errors) {
                Object.values(err.response.data.errors).forEach((item) => {
                    toast.error(item[0]);
                });
            } else {
                toast.error(err.response?.data?.message || "Something went wrong");
            }
        }
        setLoading(false);
    };

    return (

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header">
                    <h4>{isEdit ? "Update Newsletter Subscriber" : "Create Newsletter Subscriber"}</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-control" name="email" placeholder="example@gmail.com"
                                    value={form.email} onChange={handleChange} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Status</label>
                                <select className="form-select" name="status" value={form.status}
                                    onChange={handleChange} >

                                    <option value="Subscribed">Subscribed</option>
                                    <option value="Unsubscribed">Unsubscribed</option>
                                </select>
                            </div>
                        </div>

                        <hr />

                        <button type="submit" className="btn btn-primary" disabled={loading} >
                            {loading
                                ? "Saving..." : isEdit ? "Update Subscriber" : "Save Subscriber"}
                        </button>
                    </form>
                </div>
            </div>

        </div>

    );

}