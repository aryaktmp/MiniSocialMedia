import React, { useCallback, useEffect, useReducer, useState } from "react";
import Swal from "sweetalert2";
import Input from "antd/es/input/Input";
import moment from "moment/moment";
import { notification, message, Dropdown, Space } from "antd";
import { LoveComments } from "../services/CommentService";
import { PostComment } from "../services/CommentService";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Collapse } from "antd";
import ListComments from "./ListComments";
const { Panel } = Collapse;

const PanelComments = ({
  token,
  auth,
  comments,
  user,
  updateForce,
  updateLove,
  statusId,
}) => {
  const [dataCommment, setDataComment] = useState("");
  const navigate = useNavigate();

  const postComments = async () => {
    const formData = new FormData();

    formData.append("mode", "status");
    formData.append("comment", dataCommment);
    await PostComment(formData, statusId)
      .then((response) => {
        if (response.status === 201) {
          setDataComment("");
          updateForce();
          notification.open({
            icon: (
              <i
                style={{ color: "#20bf55" }}
                className="fa-solid fa-circle-check"
              ></i>
            ),
            message: "You Must Be Login!",
            description: "Must login before doing activity",
            duration: 2,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });
  };

  const dateComments = (date) => {
    return moment(date, "YYYY-MM-DDTHH:mm:ss.SSSSZ").startOf().fromNow();
  };

  return (
    <div className="wrapper-comments">
      {token === null ? (
        <div className="form-add-comments"></div>
      ) : (
        <div className="form-add-comments">
          <img
            src={
              token === null
                ? require("./../assets/images/user.png")
                : require("./../assets/images/user.png")
            }
            alt=""
          />
          <Input
            className="input-status"
            style={{
              width: "100%",
              resize: "none",
            }}
            placeholder={`Reply your Comments, ${
              auth === null ? "Guys" : auth.name
            }`}
            bordered={false}
            onChange={(e) => setDataComment(e.target.value)}
            value={dataCommment}
          />
          <button onClick={postComments} className="btn-post">
            Reply
          </button>
        </div>
      )}
      <div className="title-comments">
        <i className="fa-regular fa-comments"></i>
        <span>Comments</span>
      </div>
      {comments.length > 0 ? (
        comments.map((comment, i) => (
          <ListComments
            comment={comment}
            comments={comments}
            keyy={i}
            key={i}
            user={user}
            dateComments={dateComments}
            updateLove={updateLove}
            token={token}
            auth={auth}
            updateForce={updateForce}
          />
        ))
      ) : (
        <div className="list-comments">
          <div className="nodata">
            <img src={require("./../assets/images/inbox.png")} alt="" />
            <span>No comments added!!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelComments;
