export default function RecentPosts({ posts }) {

    return (

        <div className="card shadow-sm">
            <div className="card-header">
                <strong>Recent Posts </strong>
            </div>

            <table className="table table-hover mb-0">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>{post.title}</td>
                            <td>
                                <span className="badge bg-primary">{post.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    );

}