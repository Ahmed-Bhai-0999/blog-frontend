import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { createMenu, getMenus } from "../../../services/menuService";
import { getPages } from "../../../services/pageService";

export default function CreateMenu() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});
    const [pages, setPages] = useState([]);
    
    const [menus, setMenus] = useState([]);

    const [form, setForm] = useState({
        // Menu
        name: "",
        location: "Header",
        status: "Active",

        // First Item
        title: "",
        page_id: "",
        url: "",
        parent_id: "",
        sort_order: 0,
        target: "_self",
        icon: "",
    });

    useEffect(() => {
        loadPages();
        loadMenus();
    }, []);

    const loadMenus = async () => {
        try {
            const res = await getMenus();

            setMenus(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    const loadPages = async () => {
        try {
            const res = await getPages({per_page: 500});
            setPages(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await createMenu(form);
            toast.success(res.data.message);
            navigate("/admin/menus");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            }
            toast.error(
                err.response?.data?.message ??
                "Something went wrong."
            );
        }
        setLoading(false);
    };

    return (

        <div className="container-fluid">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-8">

                        <div className="card shadow mb-4">
                            <div className="card-header">
                                <h5 className="mb-0">Menu Information</h5>
                            </div>

                            <div className="card-body">
                                {/* Menu Name */}
                                <div className="mb-3">
                                    <label className="form-label">Menu Name</label>
                                    <input type="text" name="name" className="form-control"
                                        value={form.name} onChange={handleChange} />

                                    {errors.name && (
                                        <small className="text-danger">{errors.name[0]}</small>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Location</label>
                                        <select name="location" className="form-select" value={form.location}
                                            onChange={handleChange} >

                                            <option>Header</option>
                                            <option>Footer</option>
                                            <option>Sidebar</option>
                                            <option>Mobile</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label>Status</label>
                                        <select name="status" className="form-select" value={form.status}
                                            onChange={handleChange} >

                                            <option>Active </option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="card shadow">
                            <div className="card-header">
                                <h5>First Menu Item</h5>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label>Title</label>
                                    <input className="form-control" name="title" value={form.title}
                                        onChange={handleChange} />
                                </div>

                                <div className="mb-3">
                                    <label>Select Page</label>
                                    <select className="form-select" name="page_id" value={form.page_id}
                                        onChange={handleChange} >

                                        <option value="">Select Page</option>

                                        {pages.map((page) => (
                                            <option key={page.id} value={page.id} >{page.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="text-center my-3">
                                    <strong>OR</strong>
                                </div>

                                <div className="mb-3">
                                    <label>External URL</label>
                                    <input className="form-control" name="url" value={form.url}
                                        onChange={handleChange} />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Parent Menu</label>
                                        <select className="form-select" name="parent_id" value={form.parent_id}
                                            onChange={handleChange} >

                                            <option value="">None</option>
                                            {menus.map(menu => (
                                                <optgroup key={menu.id} label={menu.name} >
                                                    {menu.items?.map(item => (
                                                        <option key={item.id} value={item.id} >{item.title}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Sort Order</label>
                                        <input type="number" className="form-control" name="sort_order"
                                            value={form.sort_order} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Target</label>
                                        <select className="form-select" name="target" value={form.target}
                                            onChange={handleChange} >
                                            <option value="_self"> Same Window</option>
                                            <option value="_blank">New Tab</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Icon</label>
                                        <input type="text" className="form-control" name="icon"
                                            placeholder="bi bi-house" value={form.icon} onChange={handleChange} />
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="col-lg-4">

                        <div className="card shadow">
                            <div className="card-header">
                                <h5 className="mb-0"> Publish</h5>
                            </div>

                            <div className="card-body">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>Status</td>
                                            <td> 
                                                <span className="badge bg-success">
                                                    {form.status}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Location</td>
                                            <td>{form.location}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={loading} >
                                        {loading ? "Saving..." : "Create Menu"}
                                    </button>

                                    <button type="button" className="btn btn-secondary"
                                        onClick={() => navigate("/admin/menus")} >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </form>
        </div>

    );

}