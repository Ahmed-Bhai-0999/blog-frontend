import { useEffect, useState } from "react";
import { getPosts } from "../../services/postService";
import { Link } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import { getCategories } from "../../services/categoryService";
import { getTags } from "../../services/tagService";

export default function Blog() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({});

    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");

    const [sort, setSort] = useState("latest");

    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState("");

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await getPosts({page, search, category_id: categoryId,
                            per_page: 6, sort,  tag_id: tag,
                        });
            // console.log(data.data[0]);
            setPosts(data.data);
            setPagination(data.meta);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadTags = async () => {
        try {
            const data = await getTags();
            setTags(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [page, search, categoryId, sort]);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadTags();
    }, []); 

    return (

        <div className="container py-5">
            <div className="row mb-4">
                <div className="col-md-3">
                    <h2>Blog</h2>
                </div>

                <div className="col-md-3">
                    <input type="text" className="form-control" placeholder="Search..."
                        value={search} onChange={(e) => {setSearch(e.target.value); setPage(1);
                        }} />
                </div>

                <div className="col-md-2">
                    <select className="form-select" value={categoryId}
                        onChange={(e) => {setCategoryId(e.target.value); setPage(1);}} >

                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id} >{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-2">
                    <select className="form-select" value={sort}
                        onChange={(e) => {setSort(e.target.value); setPage(1);}} >

                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="views">Most Viewed</option>
                        <option value="az">A - Z</option>
                        <option value="za">Z - A</option>

                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-select" value={tag}
                        onChange={(e)=>{setTag(e.target.value); setPage(1); }} >

                        <option value="">All Tags</option>
                        {tags.map(item=>(
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}

                    </select>
                </div>
            </div>

            {loading &&
                <div className="text-center">
                    <div className="spinner-border"></div>
                </div>
            }

            <div className="row">
                {!loading && posts.length === 0 && (
                    <div className="text-center py-5">
                        <h4>No Posts Found</h4>
                    </div>
                )}

                {posts.map((post) => (
                    <div className="col-lg-4 col-md-6 mb-4" key={post.id}>
                        <div className="card h-100 shadow-sm border-0">
                            <img src={post.featured_image || "https://placehold.co/600x400"} className="card-img-top"
                                alt={post.title} style={{height: "220px",objectFit: "cover",
                                }} />

                            <div className="card-body">
                                <span className="badge bg-primary mb-2">{post.category?.name}</span>
                                <h5 className="fw-bold">{post.title}</h5>
                                <p className="text-muted small">{post.excerpt}</p>
                            </div>

                            <div className="card-footer bg-white border-0">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small>👤 {post.author?.name}</small>
                                    <small>👁 {post.views}</small>
                                </div>

                                <Link to={`/post/${post.slug}`} className="btn btn-primary w-100" >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination pagination={pagination} onPageChange={(page) => setPage(page)} />

        </div>
    );
}