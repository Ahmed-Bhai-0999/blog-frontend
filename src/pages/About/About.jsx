import { useEffect,useState } from "react";
import { getPage } from "../../services/pageService";

export default function About(){

    const [page,setPage] = useState(null);
    

    useEffect(()=>{
        loadPage();
    },[]);

    const loadPage = async()=>{
        const data = await getPage("about-us");
        setPage(data.data[0]);
    }

   if(!page){
        return (
            <div className="text-center py-5">Loading...</div>
        );
    }

    return(
        <div className="container py-5">

            <h1>{page.title}</h1>
            {page.featured_image &&
                <img src={page.featured_image} className="img-fluid rounded mb-4" />
            }

            <div dangerouslySetInnerHTML={{__html: page.content}} />

        </div>
    )
}