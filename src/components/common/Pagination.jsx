import React from "react";

export default function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.last_page <= 1) return null;

    const current = pagination.current_page;
    const last = pagination.last_page;

    const getPages = () => {
        const pages = [];

        if (last <= 7) {
            for (let i = 1; i <= last; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (current > 4) {
                pages.push("...");
            }
            const start = Math.max(2, current - 1);
            const end = Math.min(last - 1, current + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (current < last - 3) {
                pages.push("...");
            }

            pages.push(last);
        }
        return pages;
    };

    return (
        <nav className="mt-4">
            <ul className="pagination justify-content-center">

                {/* Previous */}
                <li className={`page-item ${current === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onPageChange(current - 1)} >
                        Previous
                    </button>
                </li>
{/* 
                {getPages().map((page, index) =>
                    page === "..." ? (
                        <li key={index} className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    ) : (
                        <li key={page}
                            className={`page-item ${
                                current === page ? "active" : ""
                            }`}
                        >
                            <button className="page-link" onClick={() => onPageChange(page)} >
                                {page}
                            </button>
                        </li>
                    )
                )} */}
                {getPages().map((page, index) => (
                    <li key={`${page}-${index}`}
                        className={`page-item ${
                            page === "..." ? "disabled" : current === page ? "active" : ""
                        }`}
                    >
                        {page === "..." ? (
                            <span className="page-link">...</span>
                        ) : (
                            <button className="page-link" onClick={() => onPageChange(page)} >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                {/* Next */}
                <li className={`page-item ${current === last ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onPageChange(current + 1)} >
                        Next
                    </button>
                </li>

            </ul>
        </nav>
    );
}