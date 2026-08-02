import { useState } from "react";
import { subscribeNewsletter } from "../../services/newsletterService";

export default function NewsletterWidget({ variant = "sidebar" }) {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setSubmitting(true);
            setStatus({ type: "", message: "" });
            await subscribeNewsletter(email.trim());
            setStatus({
                type: "success",
                message: "You're subscribed! Check your inbox for updates.",
            });
            setEmail("");
        } catch (err) {
            setStatus({
                type: "danger",
                message: err.message || "Subscription failed. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (variant === "full") {
        return (
            <section className="newsletter-section py-5">
                <div className="container">
                    <div className="newsletter-box text-center">
                        <span className="newsletter-label d-block mb-2">
                            Stay in the loop
                        </span>
                        <h2 className="h3 text-white mb-3">
                            Subscribe to Our Newsletter
                        </h2>
                        <p className="text-white-50 mb-4 mx-auto newsletter-desc">
                            Get the latest articles, insights, and updates delivered
                            straight to your inbox. No spam, ever.
                        </p>
                        <form
                            onSubmit={handleSubmit}
                            className="newsletter-form mx-auto"
                        >
                            <div className="input-group input-group-lg">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={submitting}
                                    aria-label="Email for newsletter"
                                />
                                <button
                                    className="btn btn-primary px-4"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <>
                                            Subscribe
                                            <i
                                                className="bi bi-send ms-2"
                                                aria-hidden="true"
                                            />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        {status.message && (
                            <div
                                className={`alert alert-${status.type} mt-3 mb-0 border-0`}
                                role="alert"
                            >
                                {status.message}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="sidebar-widget sidebar-newsletter">
            <h3 className="sidebar-widget-title">
                <i className="bi bi-envelope-heart me-2" aria-hidden="true" />
                Newsletter
            </h3>
            <p className="text-muted small mb-3">
                Subscribe for weekly updates and new articles.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <input
                        type="email"
                        className="form-control form-control-sm"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={submitting}
                        aria-label="Email for newsletter"
                    />
                </div>
                <button
                    className="btn btn-primary btn-sm w-100"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? (
                        <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                        />
                    ) : (
                        "Subscribe"
                    )}
                </button>
            </form>
            {status.message && (
                <div
                    className={`alert alert-${status.type} py-2 px-2 small border-0 mt-2 mb-0`}
                    role="alert"
                >
                    {status.message}
                </div>
            )}
        </div>
    );
}
