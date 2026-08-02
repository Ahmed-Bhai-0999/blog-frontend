import { ClipLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="text-center py-5">
            <ClipLoader size={45} />
        </div>
    );
}