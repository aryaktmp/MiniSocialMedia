import React, { useCallback, useEffect, useReducer, useState } from "react";
import Swal from "sweetalert2";
import { notification, message, Dropdown, Space } from "antd";
import { LoveComments } from "../services/CommentService";
import { PostComment } from "../services/CommentService";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Collapse } from "antd";
import { DeleteComment } from "../services/CommentService";
const { Panel } = Collapse;

export function ListSubComments({
  sub,
  keyy,
  user,
  dateComments,
  comment,
  auth,
  updateForce,
  updateLove,
  token,
}) {
  const navigate = useNavigate();
  const deleteComments = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to delete this status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await DeleteComment(sub.comment_status_id, "subComment")
          .then((response) => {
            if (response.data === "") {
              for (let i = 0; i < comment.sub_comments.length; i++) {
                if (comment.sub_comments[i].comment_status_id === sub.comment_status_id) {
                  comment.sub_comments.splice(i, 1);
                }
              }
              updateForce();
            }
          })
          .finally(() => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          });
      }
    });
  };
  const items = [
    {
      label: <Link onClick={deleteComments}>Delete Comment</Link>,
      key: "1",
      danger: true,
      disabled:
        auth != null ? (auth.id === comment.user_id ? false : true) : true,
    },
  ];
  return (
    <div className="list-sub" key={keyy}>
      <div className="header">
        <div className="user-profile">
          <div className="avatar">
            <img src={require("./../assets/images/user.png")} alt="" />
          </div>
          <div className="user">
            <div className="info">
              <span className="username">{sub.user.name}</span>
              <span className="email">{sub.user.email}</span>
            </div>
            <div className="replying-to">
              <span>
                Replying to <b>{user.name}</b> <b>and</b>{" "}
                <b>{comment.user.name}</b>
              </span>
            </div>
          </div>
        </div>
        <div className="option">
          <span className="time">{dateComments(sub.created_at)}</span>
          <Dropdown
            menu={{
              items,
            }}
            arrow
            placement="bottom"
          >
            <a onClick={(e) => e.preventDefault()} className="dropdown-option">
              <Space>
                <i className="fa-solid fa-ellipsis icon-option"></i>{" "}
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <hr />
      <div className="body-list-sub">
        <span>{sub.comment}</span>
      </div>
      <hr />
      <div className="footer-list-sub">
        <div className="love">
          <Link
            onClick={async (e) => {
              e.preventDefault();
              // loveStatus(comment.id);
              if (!token) {
                navigate("/login");
                notification.open({
                  icon: (
                    <i
                      style={{ color: "#ff6b35" }}
                      className="fa-solid fa-circle-exclamation"
                    ></i>
                  ),
                  message: "You Must Be Login!",
                  description: "Must login before doing activity",
                  duration: 2,
                });
                return;
              }
              const response = await LoveComments(sub.id);
              console.log(sub);
              sub.total_love = response.data.total_love;
              sub.love_status = response.data.love_status;
              // onClickToggleLove();
              updateLove();
              if (sub.love_status === 0) {
                notification.open({
                  icon: (
                    <i
                      style={{ color: "#c1121f" }}
                      className="fa-solid fa-face-frown"
                    ></i>
                  ),
                  message: "You Must Be Login!",
                  description: "Must login before doing activity",
                  duration: 2,
                });
              } else {
                notification.open({
                  icon: (
                    <i
                      style={{ color: "#20bf55" }}
                      className="fa-solid fa-face-smile-beam"
                    ></i>
                  ),
                  message: "You Must Be Login!",
                  description: "Must login before doing activity",
                  duration: 2,
                });
              }
            }}
          >
            <i
              className={
                sub.love_status === 1
                  ? "fa-solid fa-heart active-love"
                  : "fa-solid fa-heart disable-love"
              }
            ></i>
            <span>{sub.total_love}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
