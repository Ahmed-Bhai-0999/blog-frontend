import { useEffect,useState } from "react";
import { getCommentHistory } from "../../../services/commentService";

export default function CommentHistoryModal({commentId,show,onClose}){

    const [histories,setHistories]=useState([]);

    useEffect(()=>{
        if(show){
            loadHistory();
        }
    },[show]);

    const loadHistory=async()=>{
        const res=await getCommentHistory(commentId);
        setHistories(res.data);
    }

    if(!show) return null;

    return(

        <div className="modal d-block">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5>Comment History</h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">
                        {histories.length==0? <p>No History</p>
                            :histories.map(history=>(
                                <div key={history.id} className="border rounded p-3 mb-3" >
                                    <h6>Edited By : {history.editor?.name}</h6>
                                    <small>{history.edited_at}</small>

                                    <hr/>
                                    <strong>Old</strong>
                                    <p>{history.old_comment}</p>

                                    <strong>New</strong>
                                    <p>{history.new_comment}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>

    )

}