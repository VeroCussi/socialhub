// import React, { useState, useEffect } from "react";
// import avatar from "../../assets/img/user.png";
// import { Global } from "../../helpers/Global";

// export const Comment = ({ postId, comments: initialComments, refreshComments }) => {
//   const [newComment, setNewComment] = useState("");
//   const [showInput, setShowInput] = useState(true);
//   const [comments, setComments] = useState(initialComments);

//   useEffect(() => {
//     setComments(initialComments);
//   }, [initialComments]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (newComment.trim() === "") return;
  
//     try {
//       const request = await fetch(Global.url + `comments/${postId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           'x-auth-token': localStorage.getItem('token'),
//         },
//         body: JSON.stringify({ text: newComment }),
//       });
  
//       if (request.ok) {
//         const newCommentData = await request.json();
//         setNewComment(""); // Nettoyer le champ de commentaire
//         //setComments(prevComments => [...prevComments, newCommentData]); // Mettre à jour les commentaires localement
//         refreshComments(postId); // Appeler la prop refreshComments pour mettre à jour les commentaires dans le composant parent
//       }
  
//     } catch (error) {
//       console.error("Erreur lors de l'envoi du commentaire:", error);
//     }
//   };
  

//   const handleCancel = () => {
//     setNewComment("");
//     setShowInput(true);
//   };

//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-center row">
//         <div className="col-md-8">
//           <div className="d-flex flex-column comment-section">
//             {comments.map((comment) => (
//               <div key={comment._id} className="bg-white p-2 mb-2">
//                 <div className="d-flex flex-row user-info">
//                   <img
//                     className="rounded-circle"
//                     src={comment.userImage || avatar}
//                     width="40"
//                     alt="Foto de perfil"
//                   />
//                   <div className="d-flex flex-column justify-content-start ml-2">
//                     <span className="d-block font-weight-bold name">{comment.userId.username}</span>
//                     <span className="date text-black-50">{new Date(comment.createdAt).toLocaleString()}</span>
//                   </div>
//                 </div>
//                 <div className="mt-2">
//                   <p className="comment-text">{comment.text}</p>
//                 </div>
//               </div>
//             ))}

//             {showInput && (
//               <div className="bg-light p-2">
//                 <div className="d-flex flex-row align-items-start">
//                   <img
//                     className="rounded-circle"
//                     src={avatar}
//                     width="40"
//                     alt="Foto de perfil"
//                   />
//                   <textarea
//                     className="form-control ml-1 shadow-none textarea"
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   />
//                 </div>
//                 <div className="mt-2 text-right">
//                   <button className="btn btn-primary btn-sm shadow-none" type="button" onClick={handleCommentSubmit}>
//                     Post comment
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// import React, { useState, useEffect } from "react";
// import avatar from "../../assets/img/user.png";
// import { Global } from "../../helpers/Global";

// export const Comment = ({ postId, comments: initialComments, refreshComments }) => {
//   const [comments, setComments] = useState(initialComments);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editingText, setEditingText] = useState("");
//   const [newComment, setNewComment] = useState("");

//   useEffect(() => {
//     setComments(initialComments);
//   }, [initialComments]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (newComment.trim() === "") return;
  
//     try {
//       const request = await fetch(Global.url + `comments/${postId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           'x-auth-token': localStorage.getItem('token'),
//         },
//         body: JSON.stringify({ text: newComment }),
//       });
  
//       if (request.ok) {
//         setNewComment("");
//         // Refrescar comentarios desde el servidor
//         refreshComments(postId);
//       }
//     } catch (error) {
//       console.error("Erreur lors de l'envoi du commentaire:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;
//     try {
//       const response = await fetch(Global.url + `comments/${commentId}`, {
//         method: "DELETE",
//         headers: {
//           'x-auth-token': localStorage.getItem('token'),
//         },
//       });
//       if (response.ok) {
//         // Actualizar comentarios desde el servidor
//         refreshComments(postId);
//       } else {
//         console.error("Erreur lors de la suppression du commentaire");
//       }
//     } catch (error) {
//       console.error("Erreur lors de la suppression du commentaire:", error);
//     }
//   };

//   const handleEditComment = (comment) => {
//     setEditingCommentId(comment._id);
//     setEditingText(comment.text);
//   };

//   const handleCancelEdit = () => {
//     setEditingCommentId(null);
//     setEditingText("");
//   };

//   const handleSaveEdit = async (commentId) => {
//     try {
//       const response = await fetch(Global.url + `comments/${commentId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           'x-auth-token': localStorage.getItem('token'),
//         },
//         body: JSON.stringify({ text: editingText }),
//       });

//       if (response.ok) {
//         // Una vez editado, refrescar comentarios para obtener la última versión
//         refreshComments(postId);
//         setEditingCommentId(null);
//         setEditingText("");
//       } else {
//         console.error("Erreur lors de la mise à jour du commentaire");
//       }
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour du commentaire:", error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-center row">
//         <div className="col-md-8">
//           <div className="d-flex flex-column comment-section">
//             {comments.map((comment) => (
//               <div key={comment._id} className="bg-white p-2 mb-2">
//                 <div className="d-flex flex-row user-info">
//                   <img
//                     className="rounded-circle"
//                     src={comment.userImage || avatar}
//                     width="40"
//                     alt="Foto de profil"
//                   />
//                   <div className="d-flex flex-column justify-content-start ml-2">
//                     <span className="d-block font-weight-bold name">{comment.userId?.username || "Utilisateur"}</span>
//                     <span className="date text-black-50">
//                       {new Date(comment.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
                
//                 {editingCommentId === comment._id ? (
//                   <>
//                     <textarea
//                       className="form-control mt-2"
//                       value={editingText}
//                       onChange={(e) => setEditingText(e.target.value)}
//                     />
//                     <div className="mt-2">
//                       <button
//                         className="btn btn-success btn-sm mr-2"
//                         onClick={() => handleSaveEdit(comment._id)}
//                       >
//                         Enregistrer
//                       </button>
//                       <button
//                         className="btn btn-secondary btn-sm"
//                         onClick={handleCancelEdit}
//                       >
//                         Annuler
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="mt-2">
//                     <p className="comment-text">{comment.text}</p>
//                     <div className="mt-2 text-right">
//                       <button
//                         className="btn btn-warning btn-sm mr-2"
//                         onClick={() => handleEditComment(comment)}
//                       >
//                         Éditer
//                       </button>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => handleDeleteComment(comment._id)}
//                       >
//                         Supprimer
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             <div className="bg-light p-2">
//               <div className="d-flex flex-row align-items-start">
//                 <img
//                   className="rounded-circle"
//                   src={avatar}
//                   width="40"
//                   alt="Foto de perfil"
//                 />
//                 <textarea
//                   className="form-control ml-1 shadow-none textarea"
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                 />
//               </div>
//               <div className="mt-2 text-right">
//                 <button
//                   className="btn btn-primary btn-sm shadow-none"
//                   type="button"
//                   onClick={handleCommentSubmit}
//                 >
//                   Publier
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";

export const Comment = ({ postId, comments: initialComments, refreshComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [newComment, setNewComment] = useState("");

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
        setNewComment("");
        refreshComments(postId); // Actualizar la lista de comentarios
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;
    try {
      const response = await fetch(Global.url + `comments/${commentId}`, {
        method: "DELETE",
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      if (response.ok) {
        refreshComments(postId);
      } else {
        console.error("Erreur lors de la suppression du commentaire");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const response = await fetch(Global.url + `comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ text: editingText }),
      });

      if (response.ok) {
        refreshComments(postId);
        setEditingCommentId(null);
        setEditingText("");
      } else {
        console.error("Erreur lors de la mise à jour du commentaire");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du commentaire:", error);
    }
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
                    src={comment.userId?.userImage || avatar}
                    width="40"
                    alt="Foto de profil"
                  />
                  <div className="d-flex flex-column justify-content-start ml-2">
                    <span className="d-block font-weight-bold name">
                      {comment.userId?.username || "Utilisateur"}
                    </span>
                    <span className="date text-black-50">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {editingCommentId === comment._id ? (
                  <>
                    <textarea
                      className="form-control mt-2"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="mt-2">
                      <button
                        className="btn btn-success btn-sm mr-2"
                        onClick={() => handleSaveEdit(comment._id)}
                      >
                        Enregistrer
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancelEdit}
                      >
                        Annuler
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-2">
                    <p className="comment-text">{comment.text}</p>
                    <div className="mt-2 text-right">
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEditComment(comment)}
                      >
                        Éditer
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="bg-light p-2">
              <div className="d-flex flex-row align-items-start">
                <img
                  className="rounded-circle"
                  src={avatar}
                  width="40"
                  alt="Foto de profil"
                />
                <textarea
                  className="form-control ml-1 shadow-none textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <div className="mt-2 text-right">
                <button
                  className="btn btn-primary btn-sm shadow-none"
                  type="button"
                  onClick={handleCommentSubmit}
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
