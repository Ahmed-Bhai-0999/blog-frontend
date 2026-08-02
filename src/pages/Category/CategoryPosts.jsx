import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPosts } from "../../services/postService";
import { Link } from "react-router-dom";

export default function CategoryPosts() {

    const { slug } = useParams();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, [slug]);

    const loadPosts = async () => {
        try {
            const data = await getPosts({category_slug: slug});
            setPosts(data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border"></div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">Category : {slug}</h2>

            <div className="row">
                {posts.map(post => (
                    <div className="col-lg-4 mb-4" key={post.id}>

                        <div className="card h-100">
                            <img src={post.featured_image} className="card-img-top"
                                style={{height: "220px", objectFit: "cover"}} />

                            <div className="card-body">
                                <h5>{post.title}</h5>
                                <p>{post.excerpt}</p>
                                <Link to={`/post/${post.slug}`} className="btn btn-primary">
                                    Read More
                                </Link>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}