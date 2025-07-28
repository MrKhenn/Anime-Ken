import React from 'react';

const CommentSection: React.FC = () => {
    return (
        <div className="comentario-card">
            <div className="d-flex">
                <img src="https://i.pravatar.cc/50?img=12" className="rounded-circle me-3" alt="Avatar" />
                <div>
                    <div className="fw-bold text-light">Carlos R.</div>
                    <div className="text-muted small">29 jul 2025</div>
                    <p className="mt-2 mb-2 text-light">Una película épica, los efectos visuales son brutales.</p>
                    <div className="reacciones">
                        <button className="btn-like">
                            <i className="fa fa-thumbs-up"></i> <span>42</span>
                        </button>
                        <button className="btn-dislike ms-3">
                            <i className="fa fa-thumbs-down"></i> <span>3</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
