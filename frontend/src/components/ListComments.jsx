import React, { useCallback, useEffect, useReducer, useState } from "react";
import Swal from "sweetalert2";
import { notification, message, Dropdown, Space } from "antd";
import { LoveComments } from "../services/CommentService";
import { PostComment } from "../services/CommentService";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Collapse } from "antd";
import { DeleteComment } from "../services/CommentService";
import { ListSubComments } from "./ListSubComments";
const { Panel } = Collapse;

const ListComments = ({
  comment,
  keyy,
  user,
  dateComments,
  token,
  updateLove,
  auth,
  updateForce,
  comments,
}) => {
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
        await DeleteComment(comment.id, "comment")
          .then(async (response) => {
            if (response.data === "") {
              for (let i = 0; i < comments.length; i++) {
                if (comments[i].id === comment.id) {
                  comments.splice(i, 1);
                }
              }
              await updateForce();
            }
          })
          .finally(() => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          });
      }
    });
  };
  const navigate = useNavigate();

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
    <div className="list-comments" key={keyy}>
      <div className="header">
        <div className="user-info">
          <div className="avatar">
            <img src={require("./../assets/images/user.png")} alt="" />
          </div>
          <div className="user">
            <div className="info">
              <span className="username">{comment.user.name}</span>
              <span className="email">{comment.user.email}</span>
            </div>
            <div className="replying-to">
              <span>
                Replying to <b>{user.name}</b>
              </span>
            </div>
          </div>
        </div>
        <div className="option">
          <span className="time">{dateComments(comment.created_at)}</span>
          <Dropdown menu={{ items }} arrow placement="bottom">
            <a onClick={(e) => e.preventDefault()} className="dropdown-option">
              <Space>
                <i className="fa-solid fa-ellipsis icon-option"></i>{" "}
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <hr />
      <div className="body-list">
        <span>{comment.comment}</span>
      </div>
      <hr />
      <div className="footer-comment">
        <div className="comment">
          <Link
            onClick={async (e) => {
              e.preventDefault();
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
              }
              const { value: statusComments } = await Swal.fire({
                title: "Add Comments For this Status",
                input: "text",
                inputLabel: "Your Comments",
                showCancelButton: true,
                inputValidator: (value) => {
                  if (!value) {
                    return "You need to write something!";
                  }
                },
              });

              if (statusComments) {
                const formData = new FormData();

                formData.append("mode", "sub");
                formData.append("comment", statusComments);
                formData.append("status_id", comment.status_id);
                await PostComment(formData, comment.id)
                  .then((response) => {
                    if (response.status === 201) {
                      updateForce();
                      notification.open({
                        icon: (
                          <i
                            style={{ color: "#20bf55" }}
                            className="fa-solid fa-circle-check"
                          ></i>
                        ),
                        message: "Success to add comment!",
                        duration: 2,
                      });
                      window.scrollTo({
                        left: 0,
                        bottom: document.body.scrollHeight,
                        behavior: "smooth",
                      });
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            }}
          >
            <i className="fa-solid fa-comment"></i>
            <span>{comment.total_reply}</span>
          </Link>
        </div>
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
              const response = await LoveComments(comment.id);
              console.log(response);
              comment.total_love = response.data.total_love;
              comment.love_status = response.data.love_status;
              updateLove();
              if (comment.love_status === 0) {
                notification.open({
                  icon: (
                    <i
                      style={{ color: "#c1121f" }}
                      className="fa-solid fa-face-frown"
                    ></i>
                  ),
                  message: "You UnLove it this comment:(",
                  description: "Thank Youu!!",
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
                  message: "You Love It this comment:)",
                  description: "Thank Youu!!",
                  duration: 2,
                });
              }
            }}
          >
            <i
              className={
                comment.love_status === 1
                  ? "fa-solid fa-heart active-love"
                  : "fa-solid fa-heart disable-love"
              }
            ></i>
            <span>{comment.total_love}</span>
          </Link>
        </div>
      </div>
      <div className="panel-subcomment">
        <Collapse
          bordered={false}
          style={{
            background: "#e7ecef",
          }}
        >
          <Panel
            className="panel"
            header={`Show Replies (${comment.total_reply})`}
            key="1"
          >
            {comment?.sub_comments?.map((sub, i) => (
              <ListSubComments
                sub={sub}
                key={i}
                keyy={i}
                user={user}
                comment={comment}
                dateComments={dateComments}
                auth={auth}
                comments={comments}
                updateForce={updateForce}
                token={token}
                updateLove={updateLove}
              />
            ))}
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};
export default ListComments;
