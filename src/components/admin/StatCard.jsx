

export default function StatCard({title, value, icon, color = "primary",}) {
    return (
        <div className="col-lg-3 col-md-6 mb-4">

            <div className={`card border-0 shadow-sm bg-${color} text-white`}>

                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <small>{title}</small>
                            <h2 className="fw-bold mt-2">{value}</h2>
                        </div>
                        <i className={`bi ${icon} fs-1`}></i>
                    </div>
                </div>
                
            </div>

        </div>
    );
}