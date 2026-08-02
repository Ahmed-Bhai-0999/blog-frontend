
export default function RecentContacts({ contacts }) {

    return (

        <div className="card shadow-sm">
            <div className="card-header">
                <strong>Recent Contact Messages</strong>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.subject}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    );

}