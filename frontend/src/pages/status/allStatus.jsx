import React, { useEffect, useReducer, useState } from "react";
import "./../../assets/css/style.css";
import { Input, Skeleton, notification } from "antd";
import StatusService from "../../services/StatusService";
import PanelStatus from "../../components/PanelStatus";
import Swal from "sweetalert2";
import { PostStatus } from "../../services/StatusService";
const { TextArea } = Input;

const AllStatus = () => {
  let [token, setToken] = useState(null);
  let [auth, setAuth] = useState(null);

  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [allPost, setAllPost] = useState([]);
  const [noData, setNoData] = useState(false);
  let [page, setPage] = useState(1);
  const [rendering, forceUpdate] = useReducer((x) => x + 1, 0);

  const [lengthStatus, setLengthStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [validationWords, setValidationWords] = useState(false);

  window.onscroll = () => {
    if (
      !isLoadingComponents &&
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
    ) {
      if (!noData) {
        setIsLoadingComponents(true);
        loadAllStatus(page);
      }
    }
  };

  const ValdationStatus = (e) => {
    let statusMessage = e.target.value;
    let validateStatus = statusMessage.split(" ");
    if (validateStatus.length > 50) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Your status exceeds the given limit which is 50 words",
      });
    } else {
      validateStatus = statusMessage.split(" ", 50);
      setStatusMessage(validateStatus.join(" "));
      setLengthStatus(validateStatus.length);
    }
  };

  const postStatus = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("sentences", statusMessage);

    setIsLoadingList(true);
    await PostStatus(formData)
      .then((res) => {
        if (res.success === true) {
          setTimeout(() => {
            StatusService.getAllStatus(1)
              .then((res) => {
                // const newList = allPost.concat(res.data);
                setAllPost(res.data);
                if (res.data.length === 0) {
                  setNoData(true);
                }
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                notification.open({
                  icon: (
                    <i
                      style={{ color: "#20bf55" }}
                      className="fa-solid fa-circle-check"
                    ></i>
                  ),
                  message: "Succes to add status!",
                  duration: 2,
                });
                setIsLoadingList(false);
                setValidationWords(false);
                setStatusMessage(null);
              });
          }, 1000);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoadingList(false);
        setValidationWords(true);
        notification.open({
          icon: (
            <i
              style={{ color: "#c1121f" }}
              className="fa-solid fa-circle-exclamation"
            ></i>
          ),
          message: "422 response error",
          description: "Your status exceeds the given limit which is 50 words!",
          duration: 2,
        });
      });
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setAuth(JSON.parse(localStorage.getItem("auth")));
    setIsLoadingComponents(true);
    setIsLoadingPages(true);
    loadAllStatus(page);
  }, []);

  useEffect(() => {
    loadAllStatus(page);
  }, [rendering]);

  const loadAllStatus = async (page) => {
    setTimeout(() => {
      StatusService.getAllStatus(page)
        .then((res) => {
          const newPage = page + 1;
          setPage(newPage);
          const newList = allPost.concat(res.data);
          setAllPost(newList);
          if (res.data.length === 0) {
            setNoData(true);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoadingComponents(false);
          setIsLoadingPages(false);
          setIsLoadingList(false);
        });
    }, 1000);
  };

  // console.log(allPost);

  return (
    <div className="main-content">
      {token ? (
        isLoadingPages ? (
          <div
            className="form-add-status"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Skeleton.Avatar active size={"large"} />
            <Skeleton.Input
              active
              style={{
                width: "100%",
              }}
            />
            <Skeleton.Button active shape="round" />
          </div>
        ) : (
          <div className="form-add-status">
            <img
              src={
                token === null
                  ? require("./../../assets/images/user.png")
                  : require("./../../assets/images/user.png")
              }
              alt=""
            />
            <form onSubmit={postStatus}>
              <TextArea
                status={validationWords ? "error" : ""}
                required
                className="input-status"
                placeholder={`What's on your mind, ${
                  auth === null ? "Guys" : auth.name
                }??`}
                autoSize
                value={statusMessage}
                bordered={validationWords ? true : false}
                onChange={ValdationStatus}
              />
              <button type="submit" className="btn-post">
                Post
              </button>
            </form>
          </div>
        )
      ) : (
        ""
      )}

      {!isLoadingList ? (
        allPost.map((all, i) => (
          <PanelStatus
            data={all}
            key={i}
            keyy={i}
            tokenn={token}
            updateForce={forceUpdate}
            allData={allPost}
          />
        ))
      ) : (
        <div className="list-content">
          <Skeleton
            active
            avatar
            paragraph={{
              rows: 2,
            }}
          />
        </div>
      )}

      {isLoadingComponents ? (
        <div className="list-content">
          <Skeleton
            active
            avatar
            paragraph={{
              rows: 2,
            }}
          />
        </div>
      ) : (
        ""
      )}

      {noData ? (
        <div className="list-content">
          <div className="nodata">
            <img src={require("./../../assets/images/inbox.png")} alt="" />
            <span>It's all, Nothing More...</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default AllStatus;
