import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Comment } from "../comment/Comment";
import useAuth from "../../hooks/useAuth";
import { Edit3, Trash2, Heart, MessageCircle, Share2, Smile, Frown, Angry, Zap, Meh, ThumbsUp } from "lucide-react";

export const Feed = () => {
  const { auth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [reactions, setReactions] = useState({});
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

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

      if (request.status === 401) {
        // Token expirado, redirigir al login
        window.location.href = '/login';
        return;
      }

      const data = await request.json();
      
      // El backend devuelve directamente un array de posts
      const postsArray = Array.isArray(data) ? data : [];
      
      // Añadir el estado de reacciones a cada post
      const postsWithReactions = postsArray.map(post => ({
        ...post,
        reactions: [],
        userReaction: null,
        showComments: false
      }));
      
      setPosts(postsWithReactions);
      
      // Cargar reacciones para cada post
      postsWithReactions.forEach(post => {
        fetchReactions(post._id);
        fetchUserReaction(post._id);
      });
      
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchReactions = async (postId) => {
    try {
      const response = await fetch(Global.url + `reactions/${postId}`, {
        method: "GET",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setReactions(prev => ({
          ...prev,
          [postId]: data.counts
        }));
      }
    } catch (error) {
      console.error("Error al obtener reacciones:", error);
    }
  };

  const fetchUserReaction = async (postId) => {
    try {
      const response = await fetch(Global.url + `reactions/${postId}/user`, {
        method: "GET",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserReactions(prev => ({
          ...prev,
          [postId]: data.reaction
        }));
      }
    } catch (error) {
      console.error("Error al obtener reacción del usuario:", error);
    }
  };

  const handleReaction = async (postId, type = 'like') => {
    try {
      const response = await fetch(Global.url + `reactions/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        // Actualizar el estado local
        fetchReactions(postId);
        // Actualizar reacción del usuario
        fetchUserReaction(postId);
      }
    } catch (error) {
      console.error("Error al manejar reacción:", error);
    }
  };

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
    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        const response = await fetch(Global.url + `posts/${postId}`, {
          method: "DELETE",
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          setPosts(posts.filter((post) => post._id !== postId));
          alert("Publicación eliminada con éxito.");
        } else {
          throw new Error("Échec de la suppression de la publication.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

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
  };

  const getReactionIcon = (type) => {
    const icons = {
      like: ThumbsUp,
      love: Heart,
      haha: Smile,
      wow: Zap,
      sad: Frown,
      angry: Angry
    };
    return icons[type] || ThumbsUp;
  };

  const getReactionColor = (type) => {
    const colors = {
      like: '#4267B2',
      love: '#ED5167',
      haha: '#FFD96A',
      wow: '#FFD96A',
      sad: '#4267B2',
      angry: '#ED5167'
    };
    return colors[type] || '#4267B2';
  };

  const getReactionLabel = (type) => {
    const labels = {
      like: 'Me gusta',
      love: 'Me encanta',
      haha: 'Me divierte',
      wow: 'Me asombra',
      sad: 'Me entristece',
      angry: 'Me enoja'
    };
    return labels[type] || 'Me gusta';
  };

  const toggleComments = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button">Ver nuevas publicaciones</button>
      </header>

      <div className="content__posts">
        {posts.length > 0 ? (
          posts.map((post) => {
            const postReactions = reactions[post._id] || { total: 0, like: 0 };
            const userReaction = userReactions[post._id];
            
            return (
              <article className="posts__post" key={post._id}>
                {/* Header del post */}
                <div className="post__header">
                  <div className="post__user-info">
                    <div className="post__avatar">
                      <img
                        src={post.userId?.image || avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    </div>
                    <div className="post__user-details">
                      <span className="post__username">
                        {post.userId && post.userId.username
                          ? post.userId.username
                          : "Utilisateur inconnu"}
                      </span>
                      <span className="post__date">
                        {new Date(post.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  {auth._id === post.userId?._id && (
                    <div className="post__actions">
                      <button 
                        className="post__action-btn post__action-btn--edit"
                        onClick={() => handleEdit(post._id)}
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="post__action-btn post__action-btn--delete"
                        onClick={() => handleDelete(post._id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Contenido del post */}
                {selectedPost && selectedPost._id === post._id ? (
                  <div className="post__edit-mode">
                    <textarea
                      className="post__edit-textarea"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="Edita tu publicación..."
                    />
                    <div className="post__edit-actions">
                      <button 
                        className="post__edit-btn post__edit-btn--save"
                        onClick={handleEditSubmit}
                      >
                        Guardar
                      </button>
                      <button 
                        className="post__edit-btn post__edit-btn--cancel"
                        onClick={() => setSelectedPost(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="post__content">
                    <p>{post.content}</p>
                  </div>
                )}

                {/* Imagen del post */}
                {post.imageUrl && (
                  <div className="post__image-container">
                    <img
                      src={post.imageUrl}
                      alt="Imagen del post"
                      className="post__image"
                    />
                  </div>
                )}

                {/* Footer del post con reacciones y comentarios */}
                <div className="post__footer">
                  {/* Estadísticas de reacciones */}
                  {postReactions.total > 0 && (
                    <div className="post__reactions-summary">
                      <span className="reactions-count">
                        {postReactions.total} reacción{postReactions.total !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  )}

                  {/* Botones de interacción */}
                  <div className="post__interactions">
                    <div className="post__main-reactions">
                      <button 
                        className={`post__reaction-btn ${userReaction?.type === 'like' ? 'post__reaction-btn--active' : ''}`}
                        onClick={() => handleReaction(post._id, 'like')}
                        title="Me gusta"
                        style={{ color: '#65676b' }}
                      >
                        <ThumbsUp 
                          size={18} 
                          fill={userReaction?.type === 'like' ? 'currentColor' : 'none'}
                          color={userReaction?.type === 'like' ? getReactionColor('like') : '#666'}
                        />
                        <span style={{ color: '#65676b', fontWeight: '500' }}>Me gusta</span>
                      </button>
                      
                      <button 
                        className={`post__reaction-btn ${userReaction?.type === 'love' ? 'post__reaction-btn--active' : ''}`}
                        onClick={() => handleReaction(post._id, 'love')}
                        title="Me encanta"
                        style={{ color: '#65676b' }}
                      >
                        <Heart 
                          size={18} 
                          fill={userReaction?.type === 'love' ? 'currentColor' : 'none'}
                          color={userReaction?.type === 'love' ? getReactionColor('love') : '#666'}
                        />
                        <span style={{ color: '#65676b', fontWeight: '500' }}>Me encanta</span>
                      </button>
                    </div>

                    <div className="post__secondary-actions">
                      <button 
                        className={`post__action-btn post__action-btn--comment ${post.showComments ? 'post__action-btn--active' : ''}`} 
                        title="Comentar"
                        style={{ color: '#65676b' }}
                        onClick={() => toggleComments(post._id)}
                      >
                        <MessageCircle size={18} />
                        <span style={{ color: '#65676b', fontWeight: '500' }}>{post.comments?.length || 0}</span>
                      </button>
                      
                      <button className="post__action-btn post__action-btn--share" title="Compartir" style={{ color: '#65676b' }}>
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Botones de reacciones adicionales */}
                  <div className="post__reaction-options">
                    <button 
                      className={`post__reaction-option ${userReaction?.type === 'haha' ? 'post__reaction-option--active' : ''}`}
                      onClick={() => handleReaction(post._id, 'haha')}
                      title="Me divierte"
                    >
                      <Smile size={16} />
                    </button>
                    <button 
                      className={`post__reaction-option ${userReaction?.type === 'wow' ? 'post__reaction-option--active' : ''}`}
                      onClick={() => handleReaction(post._id, 'wow')}
                      title="Me asombra"
                    >
                      <Zap size={16} />
                    </button>
                    <button 
                      className={`post__reaction-option ${userReaction?.type === 'sad' ? 'post__reaction-option--active' : ''}`}
                      onClick={() => handleReaction(post._id, 'sad')}
                      title="Me entristece"
                    >
                      <Frown size={16} />
                    </button>
                    <button 
                      className={`post__reaction-option ${userReaction?.type === 'angry' ? 'post__reaction-option--active' : ''}`}
                      onClick={() => handleReaction(post._id, 'angry')}
                      title="Me enoja"
                    >
                      <Angry size={16} />
                    </button>
                  </div>
                </div>

                {/* Sección de comentarios desplegable */}
                {post.showComments && (
                  <div className="post__comments-section">
                    <div className="post__comments-header">
                      <h4>Comentarios ({post.comments?.length || 0})</h4>
                    </div>
                    <Comment
                      postId={post._id}
                      comments={post.comments}
                      refreshComments={refreshComments}
                    />
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="no-posts">
            <p>No hay publicaciones disponibles.</p>
          </div>
        )}
      </div>

      <div className="content__container-btn">
        <button className="content__btn-more-post">
          Ver más publicaciones
        </button>
      </div>
    </>
  );
};