import React, { useEffect, useState } from "react";
import { getUser } from "../../services/UserService";
import InfiniteScroll from "react-infinite-scroller";

const Sidebar = () => {
  const [user, setUser] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const userAll = async (page) => {
    await getUser(page)
      .then((res) => {
        const newList = user.concat(res.data);
        setUser(newList);
        if (res.data.length === 0) {
          setHasMoreItems(false);
        } else {
          setHasMoreItems(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="wrapper-sidebar">
      <div className="header-sidebar">
        <i className="fa-solid fa-users"></i>
        <span>All People</span>
      </div>
      <div
        className="body-sidebar"
        style={{
          height: "23.7rem",
          overflow: "auto",
        }}
      >
        <InfiniteScroll
          className="list"
          pageStart={0}
          loadMore={userAll}
          hasMore={hasMoreItems}
          loader={
            <div
              className="list-user"
              key={0}
              style={{
                textAlign: "center",
              }}
            >
              <div className="spinner">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          }
          useWindow={false}
        >
          {user.map((users, i) => (
            <div className="list-user" key={i}>
              <div className="header">
                <div className= "avatar">
                  <img src={require("./../../assets/images/user.png")} alt="" />
                </div>
                <div className="username">
                  <span className="name">{users.name}</span>
                  <span className="email">{users.email}</span>
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
        {!hasMoreItems ? (
          <div style={{
            margin : "20px 0"
          }} className="list-user">no data anymore ...</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Sidebar;
