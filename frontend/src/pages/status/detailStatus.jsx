import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Skeleton, Dropdown, Space, notification } from "antd";
import "./../../assets/css/detail.css";
import StatusService from "../../services/StatusService";
import PanelDetailStatus from "../../components/PanelDetailStatus";
import PanelComments from "../../components/PanelComments";

const DetailStatus = () => {
  const navigate = useNavigate();
  let [token, setToken] = useState(null);
  let [auth, setAuth] = useState(null);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [detail, setDetail] = useState({});
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState({});
  const [rendering, forceUpdate] = useReducer((x) => x + 1, 0);
  const [render, forceUpdates] = useReducer((x) => x + 1, 0);

  const { id, username } = useParams();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setAuth(JSON.parse(localStorage.getItem("auth")));
  }, [render]);

  useEffect(() => {
    setIsLoadingComponents(true);
    loadStatus();
  }, []);

  useEffect(() => {
    loadStatus();
  }, [rendering]);

  const loadStatus = () => {
    setTimeout(() => {
      StatusService.getOneStatus(id)
        .then((res) => {
          setDetail(res);
          setComments(res.comments);
          setUser(res.user);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoadingComponents(false);
        });
    }, 1500);
  };

  return (
    <>
      <div className="main-header-detail">
        <Link onClick={(e) => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <span>Status</span>
      </div>
      <div className="main-content">
        {isLoadingComponents ? (
          <div className="detail-status">
            <Skeleton
              active
              avatar
              paragraph={{
                rows: 2,
              }}
            />
          </div>
        ) : (
          <>
            <PanelDetailStatus
              detail={detail}
              updateForces={forceUpdates}
              updateForce={forceUpdate}
              auth={auth}
              user={user}
              token={token}
            />
            <PanelComments
              comments={comments}
              token={token}
              auth={auth}
              user={user}
              statusId={id}
              updateLove={forceUpdates}
              updateForce={forceUpdate}
            />
          </>
        )}
      </div>
    </>
  );
};
export default DetailStatus;
