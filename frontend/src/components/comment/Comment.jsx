import React, { useState, useEffect } from "react";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import { Edit3, Trash2, Send, X, Check } from "lucide-react";

export const Comment = ({ postId, comments: initialComments, refreshComments }) => {
  const { auth } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(Global.url + "comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          content: newComment,
          post: postId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data.comment]);
        setNewComment("");
        if (refreshComments) refreshComments(postId);
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) return;

    try {
      const response = await fetch(Global.url + `comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        if (refreshComments) refreshComments(postId);
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const response = await fetch(Global.url + `comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      if (response.ok) {
        setComments(prev =>
          prev.map(comment =>
            comment._id === commentId
              ? { ...comment, content: editContent }
              : comment
          )
        );
        setEditingComment(null);
        setEditContent("");
        if (refreshComments) refreshComments(postId);
      }
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  return (
    <div className="comments-section">
      {/* Lista de comentarios */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-user-info">
                  <img
                    className="comment-avatar"
                    src={comment.userId?.image || avatar}
                    alt="Avatar"
                  />
                  <div className="comment-user-details">
                    <span className="comment-username">{comment.userId?.name || "Usuario"}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Botones de acción solo para el autor del comentario */}
                {auth._id === comment.userId?._id && (
                  <div className="comment-actions">
                    <button 
                      className="comment-action-btn comment-action-btn--edit" 
                      onClick={() => handleEditComment(comment)} 
                      title="Editar"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="comment-action-btn comment-action-btn--delete" 
                      onClick={() => handleDeleteComment(comment._id)} 
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Contenido del comentario */}
              {editingComment === comment._id ? (
                <div className="comment-edit-mode">
                  <textarea
                    className="comment-edit-textarea"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edita tu comentario..."
                  />
                  <div className="comment-edit-actions">
                    <button 
                      className="comment-edit-btn comment-edit-btn--save" 
                      onClick={() => handleSaveEdit(comment._id)} 
                      title="Guardar"
                    >
                      <Check size={16} />
                      <span>Guardar</span>
                    </button>
                    <button 
                      className="comment-edit-btn comment-edit-btn--cancel" 
                      onClick={handleCancelEdit} 
                      title="Cancelar"
                    >
                      <X size={16} />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="comment-content">
                  <p>{comment.content}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-comments">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        )}
      </div>

      {/* Formulario para nuevo comentario */}
      <div className="comment-form-container">
        <div className="comment-form">
          <div className="comment-form-header">
            <img
              className="comment-form-avatar"
              src={auth.image || avatar}
              alt="Tu avatar"
            />
            <textarea
              className="comment-form-textarea"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
            />
          </div>
          <div className="comment-form-actions">
            <button 
              className="comment-form-btn" 
              onClick={handleCommentSubmit} 
              disabled={!newComment.trim()}
            >
              <Send size={16} />
              <span>Comentar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
