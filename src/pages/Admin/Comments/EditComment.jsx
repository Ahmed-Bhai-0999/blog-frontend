import api from "../../../services/api";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getComment, updateComment } from "../../../services/commentService";

export default function EditComment() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [statuses, setStatuses] = useState([]);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({comment: "", status: "Pending"});

    useEffect(() => {
        loadComment();
        loadStatuses();
    }, []);

    const loadStatuses = async () => {
        try {
            const res = await api.get("/admin/comment-statuses");
            setStatuses(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadComment = async () => {
        try {
            const res = await getComment(id);
            const comment = res.data;
            setFormData({
                comment: comment.comment,
                status: comment.status,
            });
        } catch (err) {
            toast.error("Comment not found.");
            navigate("/admin/comments");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value,});
    };

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const res = await updateComment(id, formData);
            toast.success(res.data.message);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: res.data.message,
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/admin/comments");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                toast.error(err.response?.data?.message);
            }
        }
    };

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between">
                <h4>Edit Comment</h4>
                <Link to="/admin/comments" className="btn btn-secondary" >Back</Link>
            </div>

            <div className="card-body">
              <form onSubmit={submitForm}>
                  <div className="mb-3">
                      <label>Comment</label>
                      <textarea name="comment" className="form-control" rows="5"
                          value={formData.comment} onChange={handleChange} />

                      {errors.comment &&
                          <small className="text-danger">{errors.comment[0]}</small>
                      }
                  </div>

                  <div className="mb-3">
                      <label>Status</label>
                      <select name="status" className="form-select" value={formData.status}
                          onChange={handleChange} >

                          {statuses.map(status => (
                              <option key={status} value={status} > {status} </option>
                          ))}
                      </select>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                      <Link to="/admin/comments" className="btn btn-secondary" >
                          Back
                      </Link>

                      <button className="btn btn-primary" type="submit" >
                          Update Comment
                      </button>
                  </div>
              </form>
            </div>
        </div>

    );

}