import React, { useState, useEffect } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";

export const Comment = ({ postId, comments: initialComments, refreshComments }) => {
  const [newComment, setNewComment] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
  
    try {
      const request = await fetch(Global.url + `comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ text: newComment }),
      });
  
      if (request.ok) {
        const newCommentData = await request.json();
        setNewComment(""); // Nettoyer le champ de commentaire
        setComments(prevComments => [...prevComments, newCommentData]); // Mettre à jour les commentaires localement
        refreshComments(); // Appeler la prop refreshComments pour mettre à jour les commentaires dans le composant parent
      }
  
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
    }
  };
  

  const handleCancel = () => {
    setNewComment("");
    setShowInput(true);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center row">
        <div className="col-md-8">
          <div className="d-flex flex-column comment-section">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-white p-2 mb-2">
                <div className="d-flex flex-row user-info">
                  <img
                    className="rounded-circle"
                    src={comment.userImage || avatar}
                    width="40"
                    alt="Foto de perfil"
                  />
                  <div className="d-flex flex-column justify-content-start ml-2">
                    <span className="d-block font-weight-bold name">{comment.userId.username}</span>
                    <span className="date text-black-50">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))}

            {showInput && (
              <div className="bg-light p-2">
                <div className="d-flex flex-row align-items-start">
                  <img
                    className="rounded-circle"
                    src={avatar}
                    width="40"
                    alt="Foto de perfil"
                  />
                  <textarea
                    className="form-control ml-1 shadow-none textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <div className="mt-2 text-right">
                  <button className="btn btn-primary btn-sm shadow-none" type="button" onClick={handleCommentSubmit}>
                    Post comment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
