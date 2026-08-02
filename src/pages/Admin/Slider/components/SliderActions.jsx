import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { deleteSlider, changeSliderStatus } from "../../../../services/sliderService";

export default function SliderActions({ slider, reload }) {

    const deleteItem = async () => {
        const result = await Swal.fire({
            title: "Delete Slider?",
            text: "You can restore it later from Trash.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteSlider(slider.id);
            toast.success(res.data.message);
            reload();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong."
            );
        }
    };

    const toggleStatus = async () => {
        const { value: status } = await Swal.fire({
            title: "Change Slider Status",
            input: "select",
            inputOptions: {
                Active: "Active",
                Inactive: "Inactive",
            },
            inputValue: slider.status,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (!status) return;

        try {
            const res = await changeSliderStatus(slider.id, status);
            toast.success(res.data.message);
            reload();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong."
            );
        }
    };

    return (

        <div className="btn-group">
            <Link to={`/admin/sliders/edit/${slider.id}`} className="btn btn-warning btn-sm" >
                Edit
            </Link>

            <button className="btn btn-success btn-sm" onClick={toggleStatus} >
                Status
            </button>

            <button className="btn btn-danger btn-sm" onClick={deleteItem} >
                Delete
            </button>
        </div>

    );
}