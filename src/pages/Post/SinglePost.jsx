import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getPostBySlug } from "../../services/postService";
import { getRelatedPosts } from "../../services/postService";

import { getPostNavigation } from "../../services/postService";
import { getComments, addComment, } from "../../services/commentService";

import { toast } from "react-toastify";

export default function SinglePost() {

    const { slug } = useParams();
    const [post, setPost] = useState(null);

    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState([]);

    const [navigation, setNavigation] = useState({previous: null, next: null,});
    const token = localStorage.getItem("token");

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const [form, setForm] = useState({
        guest_name: "",
        guest_email: "",
        comment: "",
    });

    const loadPost = async () => {
        try {
            const data = await getPostBySlug(slug);
            console.log(data);
            setPost(data.data);
        }catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const loadRelatedPosts = async (categoryId, postId) => {
        try {
            const data = await getRelatedPosts(categoryId, postId);
            setRelatedPosts(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadNavigation = async (id) => {
        const data = await getPostNavigation(id);
        setNavigation(data);
    };

    const loadComments = async(postId)=>{
        const data = await getComments(postId);
        setComments(data.data);
    }

    const submitComment = async(e)=>{
        e.preventDefault();
        console.log(form);
        try{
            await addComment({
                post_id:post.id,
                comment:form.comment,
                guest_name:form.guest_name,
                guest_email:form.guest_email,
            });
            setForm({guest_name:"", guest_email:"", comment:""});

            loadComments(post.id);
            toast.success("Comment submitted successfully");
        }catch(err){
            console.log(err.response.data);
        }
    }

    useEffect(() => {
        loadPost();
    }, [slug]);

    useEffect(() => {
        if (post?.category?.id) {
            loadRelatedPosts(
                post.category.id,
                post.id
            );
        }
    }, [post]);

    useEffect(() => {
        if(post){
            loadNavigation(post.id);
        }
    },[post]);

    useEffect(()=>{
        if(post){
            loadComments(post.id);
        }
    },[post]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container py-5"><h2>Post Not Found</h2></div>
        );
    }

    return (
        <div className="container py-5">

            {/* Featured Image */}
            <img src={post.featured_image} className="img-fluid rounded shadow mb-4 w-100"
                style={{maxHeight: "500px", objectFit: "cover" }} alt={post.title} />

            {/* Category */}
            <span className="badge bg-primary mb-3">{post.category?.name}</span>

            {/* Title */}
            <h1 className="fw-bold mb-3">{post.title}</h1>

            {/* Meta */}
            <div className="d-flex flex-wrap gap-4 text-muted mb-4">
                <span>👤 {post.author?.name} </span>
                <span>👁 {post.views} Views </span>
                <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <hr />

            {/* Content */}
            <div className="mt-4" dangerouslySetInnerHTML={{__html: post.content}} />

            <hr className="my-5" />
            <h5 className="fw-bold mb-3">Tags</h5>

            <div className="d-flex flex-wrap gap-2">
                {post.tags?.length > 0 ? (
                    post.tags.map((tag) => (
                        <span key={tag.id} className="badge bg-secondary px-3 py-2">
                            #{tag.name}
                        </span>
                    ))
                ) : (
                    <span className="text-muted"> No Tags </span>
                )}
            </div>

                {/* ================================================= */}
            <hr className="my-5" />
            <h5 className="fw-bold mb-3">Share This Post</h5>

            <div className="d-flex gap-3">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank" rel="noreferrer" className="btn btn-primary">
                    Facebook
                </a>

                <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
                    target="_blank" rel="noreferrer" className="btn btn-info text-white">
                    Twitter
                </a>

                <a href={`https://wa.me/?text=${window.location.href}`}
                    target="_blank" rel="noreferrer" className="btn btn-success">
                    WhatsApp
                </a>
            </div>

                {/* ================================================== */}
            <hr className="my-5" />
            <h3 className="fw-bold mb-4">Related Posts</h3>

            <div className="row">
                {relatedPosts.length === 0 && (
                    <div className="col-12"><p>No Related Posts</p></div>
                )}

                {relatedPosts.map((item) => (
                    <div className="col-lg-4 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm">
                            <img src={item.featured_image} className="card-img-top"
                                style={{height: "220px", objectFit: "cover"}} alt={item.title} />

                            <div className="card-body">
                                <span className="badge bg-primary">{item.category?.name}</span>
                                <h5 className="mt-3">{item.title}</h5>
                                <p>{item.excerpt ? item.excerpt.substring(0, 80) : item.content.substring(0, 80)}...</p>

                                <Link to={`/post/${item.slug}`} className="btn btn-primary" >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ============================================== */}
            <hr className="my-5"/>

            <div className="row">
                <div className="col-md-6">
                    {navigation.previous && (
                        <Link to={`/post/${navigation.previous.slug}`} className="btn btn-outline-primary w-100" >
                            ← {navigation.previous.title}
                        </Link>
                    )}
                </div>

                <div className="col-md-6 text-end">
                    {navigation.next && (
                        <Link to={`/post/${navigation.next.slug}`} className="btn btn-outline-primary w-100" >
                            {navigation.next.title} →
                        </Link>
                    )}
                </div>
            </div>

            {/*  ===================== for comment ================== */}
            <hr className="my-5"/>
            <h3 className="mb-4">Comments ({comments.length}) </h3>

            {comments.map(comment=>(
                <div className="card mb-3" key={comment.id} >
                    <div className="card-body">
                        <h6>
                            {comment.author?.name || comment.guest_name}
                        </h6>
                        <p>{comment.comment}</p>
                        <small className="text-muted">{comment.created_at}</small>
                    </div>
                </div>
            ))}

                {/* ================ Comment form ================ */}
            <hr className="my-5"/>
            <h3>Leave a Comment</h3>

            <form onSubmit={submitComment}>
                {!token && (
                    <>
                        <input className="form-control mb-3" placeholder="Your Name" value={form.guest_name}
                            onChange={(e)=>setForm({...form,guest_name:e.target.value}) }
                        />

                        <input className="form-control mb-3" placeholder="Your Email" value={form.guest_email}
                            onChange={(e)=>setForm({...form,guest_email:e.target.value})}
                        />
                    </>
                    )}
                <textarea className="form-control mb-3" rows="5" value={form.comment}
                    onChange={(e)=>setForm({...form,comment:e.target.value}) }
                />

                <button className="btn btn-primary" >Post Comment</button>
            </form>

        </div>
    );
}