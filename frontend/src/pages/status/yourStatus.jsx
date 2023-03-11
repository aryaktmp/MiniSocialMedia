import { useState, useEffect, useReducer } from "react";
import { notification, Input, List, Divider, Skeleton } from "antd";
import "./../../assets/css/style.css";
import StatusService from "../../services/StatusService";
import PanelStatus from "../../components/PanelStatus";
import Swal from "sweetalert2";
import { PostStatus } from "../../services/StatusService";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;

const YourStatus = () => {
  const navigate = useNavigate();
  let [token, setToken] = useState(null);
  let [auth, setAuth] = useState(null);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [yourPost, setYourPost] = useState([]);
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
        loadYourStatus(page);
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
    // forceUpdate()
    const formData = new FormData();
    formData.append("sentences", statusMessage);

    setIsLoadingList(true);
    await PostStatus(formData)
      .then((res) => {
        if (res.success === true) {
          setTimeout(() => {
            StatusService.getYourPosts(1)
              .then((res) => {
                // const newList = allPost.concat(res.data);
                setYourPost(res);
                if (res.length === 0) {
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
        setValidationWords(true);
        setIsLoadingList(false);
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
    if (localStorage.getItem("token") == null) {
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
    setToken(localStorage.getItem("token"));
    setAuth(JSON.parse(localStorage.getItem("auth")));
    setIsLoadingList(true);
    setIsLoadingComponents(true);
    setIsLoadingPages(true);
    loadYourStatus(page);
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setAuth(JSON.parse(localStorage.getItem("auth")));
    loadYourStatus(page);
  }, [rendering]);

  const loadYourStatus = async (page) => {
    setTimeout(() => {
      StatusService.getYourPosts(page)
        .then((res) => {
          const newPage = page + 1;
          setPage(newPage);
          const newList = yourPost.concat(res);
          setYourPost(newList);
          if (res.length === 0) {
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

  return (
    <div className="main-content">
      {isLoadingPages ? (
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
      ) : token ? (
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
              className="input-status"
              placeholder={`What's on your mind, ${
                auth === null ? "Guys" : auth.name
              }??`}
              autoSize
              required
              value={statusMessage}
              bordered={validationWords ? true : false}
              onChange={ValdationStatus}
            />
            <button className="btn-post">Post</button>
          </form>
        </div>
      ) : (
        ""
      )}

      {!isLoadingList ? (
        yourPost.map((your, i) => (
          <PanelStatus
            data={your}
            key={i}
            keyy={i}
            tokenn={token}
            updateForce={forceUpdate}
            allData={yourPost}
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
export default YourStatus;
