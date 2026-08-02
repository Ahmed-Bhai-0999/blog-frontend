import { useState } from "react";
import { addContact } from "../../services/contactService";

export default function Contact(){

    const [form, setForm] = useState({name:"", email:"", subject:"", message:"" });

    const submit=async(e)=>{
        e.preventDefault();
        await addContact(form);
        alert("Message Sent Successfully");

        setForm({name:"", email:"", subject:"", message:"" });
    }

    return(
        <div className = "container py-5">
            <h2 className = "mb-4">Contact Us</h2>

            <form onSubmit = {submit}>
                <input className = "form-control mb-3" placeholder = "Name" value = {form.name} 
                    onChange = {(e)=>setForm({...form,name:e.target.value})} />

                <input className = "form-control mb-3" placeholder = "Email" value = {form.email}
                    onChange = {(e)=>setForm({...form,email:e.target.value})} />

                <input className = "form-control mb-3" placeholder = "Subject" value = {form.subject}
                    onChange = {(e)=>setForm({...form,subject:e.target.value})} />

                <textarea rows = "5" className = "form-control mb-3" placeholder = "Message"
                    value = {form.message} onChange = {(e)=>setForm({...form,message:e.target.value})} />

                <button className = "btn btn-primary">Send Message</button>
            </form>
        </div>
    )
}