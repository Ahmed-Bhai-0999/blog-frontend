import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { getPage } from "../../services/pageService";

export default function Page(){

    const {slug}=useParams();

    const [page,setPage]=useState(null);

    useEffect(()=>{
        loadPage();
    },[slug]);

    const loadPage=async()=>{
        const data=await getPage(slug);
        setPage(data.data[0]);
    }

    if(!page){

        return 
            <div className="container py-5">Loading... </div>
    }

    return(

        <div className="container py-5">
            <h1>{page.title}</h1>
            <div dangerouslySetInnerHTML={{__html:page.content}} />
        </div>

    )
}