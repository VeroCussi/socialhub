import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const People = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers();
      }, 500); // Debounce de 500ms

      return () => clearTimeout(timeoutId);
    } else if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Cargar usuarios iniciales
  useEffect(() => {
    getUsers(1);
  }, []);

  const searchUsers = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setSearchLoading(true);
    try {
      const response = await fetch(Global.url + `user/search?q=${encodeURIComponent(searchQuery.trim())}`, {
        method: 'GET',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
        setIsSearching(true);
        
        // Verificar estado de seguimiento para los resultados de búsqueda
        data.users.forEach(user => {
          checkFollowStatus(user._id);
        });
      }
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const getUsers = async (nextPage = 1) => {
    try {
      // Requête pour obtenir les utilisateurs
      const request = await fetch(Global.url + 'user/list/' + nextPage, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });

      const data = await request.json();

      // Créer un état pour pouvoir les lister
      if (data.users && data.status === 'success') {
        let newUsers = data.users;

        if (users.length >= 1) {
          newUsers = [...users, ...data.users];
        }

        setUsers(newUsers);
        
        // Verificar el estado de seguimiento pour chaque utilisateur
        newUsers.forEach(user => {
          checkFollowStatus(user._id);
        });
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const checkFollowStatus = async (userId) => {
    try {
      const response = await fetch(Global.url + `user/stats/${userId}`, {
        method: 'GET',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Verificar si el usuario actual está siguiendo a este usuario
        const isFollowing = auth.following && auth.following.includes(userId);
        setFollowStatus(prev => ({
          ...prev,
          [userId]: {
            isFollowing,
            followers: data.stats.followers,
            following: data.stats.following,
            posts: data.stats.posts
          }
        }));
      }
    } catch (error) {
      console.error('Error al verificar estado de seguimiento:', error);
    }
  };

  const handleFollow = async (userId) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const isFollowing = followStatus[userId]?.isFollowing;
      const method = isFollowing ? 'DELETE' : 'POST';
      const endpoint = isFollowing ? `unfollow/${userId}` : `follow/${userId}`;

      const response = await fetch(Global.url + `user/${endpoint}`, {
        method,
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        // Actualizar el estado local
        setFollowStatus(prev => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            isFollowing: !isFollowing,
            followers: isFollowing 
              ? prev[userId].followers - 1 
              : prev[userId].followers + 1
          }
        }));

        // Actualizar el contexto de autenticación
        if (!isFollowing) {
          // Añadir a following
          const updatedFollowing = [...(auth.following || []), userId];
          localStorage.setItem('user', JSON.stringify({ ...auth, following: updatedFollowing }));
        } else {
          // Remover de following
          const updatedFollowing = (auth.following || []).filter(id => id !== userId);
          localStorage.setItem('user', JSON.stringify({ ...auth, following: updatedFollowing }));
        }
      }
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Determinar qué usuarios mostrar
  const displayUsers = isSearching ? searchResults : users;

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">People</h1>
        
        {/* Barra de búsqueda */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="fa fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={clearSearch}
                title="Limpiar búsqueda"
              >
                <i className="fa fa-times"></i>
              </button>
            )}
          </div>
          {searchLoading && (
            <div className="search-loading">
              <i className="fa fa-spinner fa-spin"></i> Buscando...
            </div>
          )}
        </div>
      </header>

      <div className="content__posts">
        {isSearching && searchQuery && (
          <div className="search-info">
            <p>Resultados de búsqueda para: <strong>"{searchQuery}"</strong></p>
            <p>Se encontraron {searchResults.length} usuarios</p>
          </div>
        )}

        {displayUsers.length > 0 ? (
          displayUsers.map(user => {
            const userStats = followStatus[user._id] || {};
            const isFollowing = userStats.isFollowing || false;
            
            return (
              <article className="posts__post" key={user._id}>
                <div className="post__container">
                  <div className="post__image-user">
                    <a href="#" className="post__image-link">
                      {user.image !== "image.jpg" && (
                        <img 
                          src={Global.url + "user/avatar/" + user.image} 
                          className="post__user-image" 
                          alt="Photo de profil"
                        />
                      )}
                      {user.image === "image.jpg" && (
                        <img 
                          src={avatar} 
                          className="post__user-image" 
                          alt="Photo de profil"
                        />
                      )}
                    </a>
                  </div>

                  <div className="post__body">
                    <div className="post__user-info">
                      <a href="#" className="user-info__name">
                        {user.username}
                      </a>
                      <span className="user-info__divider"> | </span>
                      <a href="#" className="user-info__create-date">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </a>
                    </div>

                    <h4 className="post__content">
                      {user.bio || "Bonjour, bonne journée !"}
                    </h4>

                    {/* Estadísticas del usuario */}
                    <div className="user-stats">
                      <span className="stat-item">
                        <i className="fa fa-users"></i> {userStats.followers || 0} seguidores
                      </span>
                      <span className="stat-item">
                        <i className="fa fa-user-plus"></i> {userStats.following || 0} siguiendo
                      </span>
                      <span className="stat-item">
                        <i className="fa fa-file-text"></i> {userStats.posts || 0} posts
                      </span>
                    </div>
                  </div>
                </div>

                <div className="post__buttons">
                  <button 
                    className={`post__button ${isFollowing ? 'following' : 'follow'}`}
                    onClick={() => handleFollow(user._id)}
                    disabled={loading || user._id === auth._id}
                  >
                    {user._id === auth._id ? 'Tú' : isFollowing ? 'Siguiendo' : 'Seguir'}
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="no-results">
            {isSearching ? (
              <p>No se encontraron usuarios que coincidan con tu búsqueda.</p>
            ) : (
              <p>Aucune publication disponible.</p>
            )}
          </div>
        )}
      </div>

      {/* Solo mostrar botón de "ver más" si no estamos buscando */}
      {!isSearching && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver más de personas
          </button>
        </div>
      )}
    </>
  );
};
