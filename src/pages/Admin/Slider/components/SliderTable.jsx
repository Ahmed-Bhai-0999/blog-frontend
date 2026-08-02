import Loader from "../../../../components/common/Loader";
import Pagination from "../../../../components/common/Pagination";

import SliderRow from "./SliderRow";

export default function SliderTable({sliders,meta,loading,reload,onPageChange}) {

    if (loading) {
        return <Loader />
    }

    return (

        <div>
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Sort</th>
                        <th>Published</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sliders.length > 0 ? (
                        sliders.map((slider, index) => (
                            <SliderRow key={slider.id} slider={slider} index={index} meta={meta}
                                reload={reload} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No Slider Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination pagination={meta} onPageChange={onPageChange} />
        </div>
    );

}