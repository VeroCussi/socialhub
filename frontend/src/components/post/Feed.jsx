import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Comment } from "../comment/Comment";

export const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const fetchPosts = async () => {
    try {
      const request = await fetch(Global.url + "posts/", {
        method: "GET",
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      if (request.status === 403) {
        throw new Error("Vous n'avez pas la permission d'accéder aux publications");
      }

      const data = await request.json();
      setPosts(data);

      // Una vez que los posts se cargaron, llamamos a refreshComments para cada uno
      data.forEach((post) => {
        refreshComments(post._id);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des publications:", error);
    }
  };

  useEffect(() => {
      fetchPosts();
  }, []);

  const refreshComments = async (postId) => {
    if (!postId) {
      console.error("postId is undefined in refreshComments");
      return;
    }
    try {
      const response = await fetch(Global.url + `comments/${postId}`, {
        method: "GET",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedComments = await response.json();
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: updatedComments } : post
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour des commentaires :", error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
      try {
        const response = await fetch(Global.url + `posts/${postId}`, {
          method: "DELETE",
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          setPosts(posts.filter((post) => post._id !== postId));
          alert("Publication supprimée avec succès.");
        } else {
          throw new Error("Échec de la suppression de la publication.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // const handleEdit = (postId) => {
  //   console.log("Post ID recibido para editar:", postId);
  //   const post = posts.find((p) => p._id === postId);
  //   if (post) {
  //     console.log("Post encontrado:", post);
  //     setSelectedPost(post);
  //     setEditedContent(post.content);
  //     setShowEditModal(true);
  //   } else {
  //     console.error("Post no encontrado con el ID:", postId);
  //   }
  // };
  

  // const handleEditSubmit = async () => {
  //   try {
  //     const response = await fetch(Global.url + `posts/${selectedPost._id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-auth-token": localStorage.getItem("token"),
  //       },
  //       body: JSON.stringify({ content: editedContent }), // Envoyer uniquement le contenu
  //     });
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Erreur lors de la mise à jour.");
  //     }
  
  //     const updatedPost = await response.json();
  //     console.log("Post mis à jour:", updatedPost);
  
  //     // Actualiser la liste des posts
  //     setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  //     setShowEditModal(false);
  //     alert("Publication mise à jour avec succès.");
  //   } catch (error) {
  //     console.error("Erreur lors de la mise à jour:", error.message);
  //     alert(`Erreur: ${error.message}`);
  //   }
  // };

  const handleEdit = (postId) => {
    const post = posts.find((p) => p._id === postId);
    if (post) {
      setSelectedPost(post);
      setEditedContent(post.content);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(Global.url + `posts/${selectedPost._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
        setSelectedPost(null); // Vuelve al estado de no edición
        alert("Publication mise à jour avec succès.");
      } else {
        throw new Error("Échec de la mise à jour de la publication.");
      }
    } catch (error) {
      console.error(error);
    }
    try {
      const response = await fetch(Global.url + `posts/${selectedPost._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
        alert("Publication mise à jour avec succès.");
      } else {
        throw new Error("Échec de la mise à jour de la publication.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button">Afficher les nouvelles</button>
      </header>

      <div className="content__posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="posts__post">
              <div className="post__header">
                <div className="post__image-user">
                  <img
                    src={post.userImage || avatar}
                    className="post__user-image"
                    alt="Foto de perfil"
                  />
                </div>
                <div className="post__user-info">
                  <span className="user-info__name">
                    {post.userId && post.userId.username
                      ? post.userId.username
                      : "Utilisateur inconnu"}
                  </span>
                  <span className="user-info__create-date">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="post__actions">
                <button onClick={() => handleEdit(post._id)}>Modifier</button>
                  <button onClick={() => handleDelete(post._id)}>Supprimer</button>
                </div>
              </div>

              {selectedPost && selectedPost._id === post._id ? (
                <div className="post__content-edit">
                  <textarea
                    className="edit__textarea"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  ></textarea>
                  <div className="edit__actions">
                    <button onClick={handleEditSubmit}>Enregistrer</button>
                    <button onClick={() => setSelectedPost(null)}>Annuler</button>
                  </div>
                </div>
              ) : (
                <div className="post__content">{post.content}</div>
              )}

              {post.imageUrl && (
                <div className="post__image">
                  <img
                    src={post.imageUrl}
                    alt="Imagen del post"
                    className="post__content-image"
                  />
                </div>
              )}

              <div className="post__footer">
                <div className="footer__like-comment">
                  <div className="interaction__button">
                    <i className="fa fa-heart"></i> 26
                  </div>
                  <div className="interaction__button">
                    <i className="fa fa-comment"></i> {post.comments.length}{" "}
                    commentaires
                  </div>
                </div>
                <div className="interaction__button">
                  <i className="fa fa-share"></i> Partager
                </div>
              </div>

              <Comment
                postId={post._id}
                comments={post.comments}
                refreshComments={refreshComments}
              />
            </div>
          ))
        ) : (
          <p>Aucune publication disponible.</p>
        )}
      </div>


      <div className="content__container-btn">
        <button className="content__btn-more-post">
          Voir plus de publications
        </button>
      </div>
    </>
  );
};