
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../services/api";
import { editPost, updatePost } from "../../../services/postService";
import { getCategories } from "../../../services/categoryService";
import { getTags } from "../../../services/tagService";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { toast } from "react-toastify";

export default function EditPost() {

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        category_id: "",
        tags: [],
        status: "Draft",
        featured_image: null,
        old_image: "",
    });

    const editorRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
        loadStatuses();
    }, []);

    useEffect(() => {
        if(id){
            loadPost();
        }
    }, [id]);

    const loadData = async () => {
        try {
            const cat = await getCategories();
            const tag = await getTags();

            setCategories(cat.data || cat);
            setTags(tag.data || tag);
        } catch (err) {
            console.log(err);
        }
    };

    const loadStatuses = async () => {
        try {
            const res = await api.get("/post-statuses");
            setStatuses(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm(prev => ({...prev, [name]: files[0] }));
        } else {
            setForm(prev => ({...prev, [name]: value }));
        }
    };

    const handleTags = (id) => {
        let selected = [...form.tags];
        if (selected.includes(id)) {
            selected = selected.filter((item) => item !== id);
        } else {
            selected.push(id);
        }

        setForm({...form, tags: selected, });
    };

    const loadPost = async () => {
        try {
            const res = await editPost(id);
            // console.log(res);
            const post = res.data;

            setForm({
                title: post.title || "",
                excerpt: post.excerpt || "",
                content: post.content || "",
                category_id: post.category?.id || "",
                tags: post.tags.map(item => item.id),
                status: post.status || "Draft",
                featured_image: null,
                old_image: post.featured_image || "",
            });

            if (editorRef.current) {
                editorRef.current.setData(post.content || "");
            }
        } catch (err) {
            toast.error("Unable to load post");
        }
    };

    const submit = async (e) => {
        e.preventDefault();

        const fd = new FormData();

        fd.append("title", form.title);
        fd.append("excerpt", form.excerpt);
        fd.append("content", form.content);
        fd.append("category_id", form.category_id);
        fd.append("status", form.status);

        form.tags.forEach((tag) => {
            fd.append("tags[]", tag);
        });

        if (form.featured_image) {
            fd.append("featured_image", form.featured_image);
        }

        try {
            const res = await updatePost(id, fd);
            toast.success(res.data.message);
            navigate("/admin/posts");

            // reset form
            setForm({title: "", excerpt: "", content: "", category_id: "", tags: [],
                status: "Draft", featured_image: null,
            });

            // file input clear
            document.querySelector('input[name="featured_image"]').value = "";

            // CKEditor clear
            if (editorRef.current) {
                editorRef.current.setData("");
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (

        <div className="card shadow">
            <div className="card-header"> <h4>Edit Post</h4> </div>

            <div className="card-body">
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label>Title</label>
                        <input type="text" className="form-control" name="title" value={form.title}
                            onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label>Excerpt</label>
                        <textarea rows="3" className="form-control" name="excerpt" value={form.excerpt}
                            onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label>Content</label>
                        <CKEditor editor={ClassicEditor} data={form.content}
                            onReady={(editor) => {editorRef.current = editor; }}
                            onChange={(event, editor) => {
                                setForm((prev) => ({...prev, content: editor.getData(), }));
                            }}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Category</label>
                        <select className="form-select" name="category_id" value={form.category_id}
                            onChange={handleChange} >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}> {category.name} </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Tags</label>
                        {tags.map(tag => (
                            <div className="form-check" key={tag.id}>
                                <input type="checkbox" className="form-check-input" checked={form.tags.includes(tag.id)}
                                    onChange={() => handleTags(tag.id)} />

                                <label className="form-check-label">{tag.name}</label>
                            </div>
                        ))}
                    </div>

                    <div className="mb-3">
                        <label>Status</label>
                        <select className="form-select" name="status" value={form.status}
                            onChange={handleChange} >

                            {statuses.map(status => (
                                <option key={status} value={status} > {status} </option>
                            ))}
                        </select>
                    </div>

                    {form.old_image && (
                        <div className="mb-3">
                            <img src={form.old_image} alt="" width="180" className="img-thumbnail" />
                        </div>
                    )}

                    <div className="mb-3">
                        <label>Featured Image</label>
                        <input type="file" className="form-control" name="featured_image"
                            onChange={handleChange} />
                    </div>

                    <button className="btn btn-primary">Update Post</button>
                </form>
            </div>
        </div>

    );

}