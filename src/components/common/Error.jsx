export default function Error({ message }) {
    return (
        <div className="alert alert-danger">
            {message}
        </div>
    );
}