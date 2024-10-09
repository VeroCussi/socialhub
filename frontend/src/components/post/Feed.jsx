import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Comment } from "../comment/Comment";

export const Feed = () => {
  const [posts, setPosts] = useState([]);

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
      const response = await fetch(Global.url + `comments/${postId}`);
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
                  <span className="user-info__name">{post.userId.username}</span>
                  <span className="user-info__create-date">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="post__content">{post.content}</div>

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
                    <i className="fa fa-comment"></i> {post.comments.length} commentaires
                  </div>
                </div>
                <div className="interaction__button">
                  <i className="fa fa-share"></i> Partager
                </div>
              </div>

              <Comment postId={post._id} comments={post.comments} refreshComments={refreshComments} />
            </div>
          ))
        ) : (
          <p>Aucune publication disponible.</p>
        )}
      </div>

      <div className="content__container-btn">
        <button className="content__btn-more-post">Voir plus de publications</button>
      </div>
    </>
  );
};