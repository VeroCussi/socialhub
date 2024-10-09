import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';

export const People = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getUsers(1);
  }, [])

  const getUsers = async(nextPage = 1) => {

    // Requête pour obtenir les utilisateurs
    const request = await fetch (Global.url + 'user/list/' + nextPage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      }
    });

    const data = await request.json();

    // Créer un état pour pouvoir les lister
    if(data.users && data.status === 'success') {

      let newUsers = data.users;

      if(users.length >=1) {
        newUsers = [...users, ...data.users];
      }

      setUsers(newUsers);
    }

  }

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
  }

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">People</h1>
      </header>

      <div className="content__posts">

        {users.map(user => {

          return(
            <article className="posts__post" key={user._id}>
          <div className="post__container">
            <div className="post__image-user">
              <a href="#" className="post__image-link">
              {user.image !="image.jpg" && <img src={ Global.url + "user/avatar" + user.image } className="post__user-image" alt="Photo de profil"
                />}
              {user.image =="image.jpg" && <img src={ avatar } className="post__user-image" alt="Photo de profil"
                />}
              </a>
            </div>

            <div className="post__body">
              <div className="post__user-info">
                <a href="#" className="user-info__name">
                  {user.username}
                </a>
                <span className="user-info__divider"> | </span>
                <a href="#" className="user-info__create-date">
                  {user.createdAt}
                </a>
              </div>

              <h4 className="post__content">Bonjour, bonne journée !</h4>
            </div>
          </div>

          <div className="post__buttons">
            <a href="#" className="post__button">
              Suivre
            </a>
          </div>
        </article>
          )
        })}

      </div>

      
        <div className="content__container-btn">
        <button className="content__btn-more-post" onClick={nextPage}>
          Voir plus de personnes
        </button>
      </div>
    
      
    </>
  );
}
