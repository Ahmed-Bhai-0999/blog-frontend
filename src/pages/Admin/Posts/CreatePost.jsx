import { useEffect, useState, useRef } from "react";

import api from "../../../services/api";
import { createPost } from "../../../services/postService";
import { getCategories } from "../../../services/categoryService";
import { getTags } from "../../../services/tagService";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { toast } from "react-toastify";

export default function CreatePost() {

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
    });

    useEffect(() => {
        loadData();
        loadStatuses();
    }, []);

    const editorRef = useRef(null);

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
        setForm((prev) => ({...prev,
            [name]: files ? files[0] : value,
        }));

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
            const res = await createPost(fd);
            toast.success(res.data.message);

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
            <div className="card-header"> <h4>Create Post</h4> </div>

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

                    <div className="mb-3">
                        <label>Featured Image</label>
                        <input type="file" className="form-control" name="featured_image"
                            onChange={handleChange} />
                    </div>

                    <button className="btn btn-primary">Save Post</button>
                </form>
            </div>
        </div>

    );

}