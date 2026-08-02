import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import api from "../../../services/api";

import { createSetting, updateSetting, editSetting } from "../../../services/settingService";

export default function SettingForm({ isEdit = false }) {
    
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [statuses, setStatuses] = useState([]);
    const [logoPreview, setLogoPreview] = useState("");

    const [faviconPreview, setFaviconPreview] = useState("");

    const [form, setForm] = useState({
        site_name: "",
        site_tagline: "",
        site_description: "",
        site_email: "",
        site_phone: "",
        site_address: "",

        facebook_url: "",
        twitter_url: "",
        instagram_url: "",
        linkedin_url: "",
        youtube_url: "",

        timezone: "",
        language: "",

        posts_per_page: 10,
        default_post_status: "Draft",

        google_analytics: "",
        google_search_console: "",

        copyright: "",

        maintenance_mode: false,
        allow_comments: true,

        site_logo: null,
        site_favicon: null,
    });

    useEffect(() => {
        loadStatuses();
        if(isEdit){
            loadSetting();
        }
    },[]);


    const loadSetting = async () => {
        try {
            const res = await editSetting(id);
            const setting = res.data.data;

            setForm({
                site_name: setting.site_name || "",
                site_tagline: setting.site_tagline || "",
                site_description: setting.site_description || "",
                site_email: setting.site_email || "",
                site_phone: setting.site_phone || "",
                site_address: setting.site_address || "",

                facebook_url: setting.facebook_url || "",
                twitter_url: setting.twitter_url || "",
                instagram_url: setting.instagram_url || "",
                linkedin_url: setting.linkedin_url || "",
                youtube_url: setting.youtube_url || "",

                copyright: setting.copyright || "",
                maintenance_mode: setting.maintenance_mode,
                allow_comments: setting.allow_comments,

                timezone: setting.timezone || "",
                language: setting.language || "",

                posts_per_page: setting.posts_per_page || 10,
                default_post_status:setting.default_post_status || "Draft",

                google_analytics:setting.google_analytics || "",
                google_search_console:setting.google_search_console || "",

                logo: null,
                favicon: null,
            });
           setLogoPreview(setting.site_logo);
setFaviconPreview(setting.site_favicon);

console.log("Logo Preview:", setting.site_logo);
console.log("Favicon Preview:", setting.site_favicon);

            // setLogoPreview(setting.logo);
            // setFaviconPreview(setting.favicon);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleLogo = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm((prev) => ({...prev, site_logo: file}));
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleFavicon = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm((prev) => ({...prev, site_favicon: file}));
        setFaviconPreview(URL.createObjectURL(file));
    };

    const loadStatuses = async () => {
        try {
            const res = await api.get("/setting-statuses");
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
                res = await updateSetting(id, data);
            } else {
                res = await createSetting(data);
            }

            toast.success(res.data.message);
            navigate("/admin/settings");
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
        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                        {isEdit ? "Update Website Settings" : "Create Website Settings"}
                    </h4>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 border rounded-3 p-4 mb-4">
                                <div className="card-header ">
                                    <h5 className="mb-0">General Information</h5>
                                </div>

                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Site Name</label>
                                            <input type="text" name="site_name" className="form-control"
                                                value={form.site_name} onChange={handleChange} />

                                            {errors.site_name &&
                                                <small className="text-danger">{errors.site_name[0]}</small>
                                            }
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Site Tagline</label>
                                            <input type="text" name="site_tagline" className="form-control"
                                                value={form.site_tagline} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea rows="4" className="form-control" name="site_description"
                                            value={form.site_description} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 border rounded-3 p-4 mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">Contact Information</h5>
                                </div>

                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label>Email</label>
                                            <input type="email" name="site_email" className="form-control"
                                                value={form.site_email} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label>Phone</label>
                                            <input type="text" name="site_phone" className="form-control"
                                                value={form.site_phone} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label>Address</label>
                                            <input type="text" name="site_address" className="form-control"
                                                value={form.site_address} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 border rounded-3 p-4 mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">Social Media</h5>
                                </div>

                                <div className="card-body">

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Facebook URL</label>
                                            <input type="url" name="facebook_url" className="form-control"
                                                value={form.facebook_url} onChange={handleChange} />

                                            {errors.facebook_url &&
                                                <small className="text-danger">{errors.facebook_url[0]}</small>
                                            }
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Twitter URL</label>
                                            <input type="url" name="twitter_url" className="form-control"
                                                value={form.twitter_url} onChange={handleChange} />

                                            {errors.twitter_url &&
                                                <small className="text-danger">{errors.twitter_url[0]}</small>
                                            }
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Instagram URL</label>
                                            <input type="url" name="instagram_url" className="form-control"
                                                value={form.instagram_url} onChange={handleChange} />

                                            {errors.instagram_url &&
                                                <small className="text-danger">{errors.instagram_url[0]}</small>
                                            }
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">LinkedIn URL</label>
                                            <input type="url" name="linkedin_url" className="form-control"
                                                value={form.linkedin_url} onChange={handleChange} />

                                            {errors.linkedin_url &&
                                                <small className="text-danger">{errors.linkedin_url[0]}</small>
                                            }
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">YouTube URL</label>
                                            <input type="url" name="youtube_url" className="form-control"
                                                value={form.youtube_url} onChange={handleChange} />

                                            {errors.youtube_url &&
                                                <small className="text-danger">{errors.youtube_url[0]}</small>
                                            }
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-6 border rounded-3 p-4 mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">Website Configuration</h5>
                                </div>

                                <div className="card-body">

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Timezone </label>
                                            <input type="text" name="timezone" className="form-control"
                                                value={form.timezone} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Language</label>
                                            <input type="text" name="language" className="form-control"
                                                value={form.language} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Posts Per Page</label>
                                            <input type="number" name="posts_per_page" className="form-control"
                                                value={form.posts_per_page} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Default Status</label>
                                            <select className="form-select" name="default_post_status" 
                                                value={form.default_post_status} onChange={handleChange} >

                                                {statuses.map(status => (
                                                    <option key={status} value={status} > {status} </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-check mt-3">
                                                <input type="checkbox" className="form-check-input" name="maintenance_mode"
                                                    checked={form.maintenance_mode} onChange={handleChange} />

                                                <label className="form-check-label">Maintenance Mode</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-check mt-3">
                                                <input type="checkbox" className="form-check-input" name="allow_comments"
                                                    checked={form.allow_comments} onChange={handleChange} />

                                                <label className="form-check-label">Allow Comments</label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="col-md-6 border rounded-3 p-4 mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">SEO Settings</h5>
                                </div>

                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Google Analytics</label>
                                        <textarea rows="3" className="form-control" name="google_analytics"
                                            value={form.google_analytics} onChange={handleChange} />

                                        {errors.google_analytics &&
                                            <small className="text-danger">{errors.google_analytics[0]}</small>
                                        }
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Google Search Console </label>
                                        <textarea rows="3" className="form-control" name="google_search_console"
                                            value={form.google_search_console} onChange={handleChange} />

                                        {errors.google_search_console &&
                                            <small className="text-danger">{errors.google_search_console[0]}</small>
                                        }
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Copyright</label>
                                        <input type="text" className="form-control" name="copyright"
                                            value={form.copyright} onChange={handleChange} />

                                        {errors.copyright &&
                                            <small className="text-danger">{errors.copyright[0]}</small>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 border rounded-3 p-4 mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">Website Media</h5>
                                </div>

                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label className="form-label">Site Logo</label>
                                            <input type="file" className="form-control" accept="image/*"
                                                onChange={handleLogo} />

                                            {errors.site_logo &&
                                                <small className="text-danger"> {errors.site_logo[0]} </small>
                                            }

                                            {logoPreview ? (
                                                <div className="mt-3">
                                                    <img src={logoPreview} alt="Logo" className="img-thumbnail" width="120"
                                                        onError={(e) => console.log("Logo Error:", e.target.src)}
                                                    />
                                                </div>
                                            ) : (
                                                <p>No Logo</p>
                                            )}
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label">Site Favicon</label>
                                            <input type="file" className="form-control" accept=".png,.ico,image/png"
                                                onChange={handleFavicon} />

                                            {errors.site_favicon &&
                                                <small className="text-danger"> {errors.site_favicon[0]} </small>
                                            }

                                            {faviconPreview && (
                                                <div className="mt-3">
                                                    <img src={faviconPreview} className="img-thumbnail"
                                                        style={{width: 100, borderRadius: 10}} alt="" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-end">
                                <button type="submit" className="btn btn-primary px-5" disabled={loading} >
                                    {loading ? "Saving..." : isEdit ? "Update Settings" : "Create Settings"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
