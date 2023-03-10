import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Skeleton,
  Input,
  Dropdown,
  Space,
  notification,
  Modal,
  Button,
  Form,
} from "antd";
import "./../assets/css/detail.css";
import { LoveStatus } from "../services/StatusService";
import { PostComment } from "../services/CommentService";
import { UpdateStatus } from "../services/StatusService";
import { DeleteStatus } from "../services/StatusService";
import Swal from "sweetalert2";

const { TextArea } = Input;

const PanelDetailStatus = ({
  detail,
  updateForces,
  updateForce,
  user,
  token,
  auth,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  const [validationWords, setValidationWords] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [lengthStatus, setLengthStatus] = useState(null);
  const navigate = useNavigate();

  const dateStatus = () => {
    const date = new Date(detail.created_at);
    let dateFormat =
      date.getHours() + ":" + date.getMinutes() + " • " + date.toDateString();
    return dateFormat;
  };

  useEffect(() => {
    form.setFieldsValue({
      sentences: detail.sentences,
    });
  }, []);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const updateStatus = async (e) => {
    e.preventDefault();
    if (!token && !auth) {
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
    const formData = new FormData();
    formData.append("sentences", statusMessage);
    setConfirmLoading(true);
    try {
      await UpdateStatus(formData, detail.id).then((response) => {
        detail.sentences = response.sentences;
        notification.open({
          icon: (
            <i
              style={{ color: "#20bf55" }}
              className="fa-solid fa-circle-check"
            ></i>
          ),
          message: "Succes to Update status!",
          duration: 2,
        });
        updateForces();
        setStatusMessage(null);
        setValidationWords(false);
        setConfirmLoading(false);
        setOpen(false);
      });
    } catch (error) {
      console.log(error);
      setValidationWords(true);
      setConfirmLoading(false);
      setStatusMessage(null);
      setOpen(false);
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

  const deleteStatus = (e) => {
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
        await DeleteStatus(detail.id).then((response) => {
          if (response.data === "") {
            navigate(-1);
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          }
        });
      }
    });
  };

  const items = [
    {
      label: <Link onClick={showModal}>Edit Status</Link>,
      key: "0",
      disabled:
        auth != null ? (auth.id === detail.user_id ? false : true) : true,
    },
    {
      type: "divider",
    },
    {
      label: <Link onClick={deleteStatus}>Delete Status</Link>,
      key: "1",
      danger: true,
      disabled:
        auth != null ? (auth.id === detail.user_id ? false : true) : true,
    },
  ];

  const loveStatus = async (id) => {
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
    const response = await LoveStatus(id);
    console.log(detail);
    detail.total_love = response.data.total_love;
    detail.love_status = response.data.love_status;
    updateForces();
    if (detail.love_status === 0) {
      notification.open({
        icon: (
          <i
            style={{ color: "#c1121f" }}
            className="fa-solid fa-face-frown"
          ></i>
        ),
        message: "You UnLove it this status:(",
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
        message: "You Love It this status:)",
        description: "Thank Youu!!",
        duration: 2,
      });
    }
  };
  return (
    <div className="detail-status">
      <Modal
        title="Edit Your Status"
        open={open}
        onOk={updateStatus}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={updateStatus}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="sentences" label="New Status">
            <TextArea
              status={validationWords ? "error" : ""}
              required
              className="input-status"
              placeholder="New Status"
              autoSize
              value={statusMessage}
              onChange={ValdationStatus}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div className="header">
        <div className="user-info">
          <div className="avatar">
            <img src={require("./../assets/images/user.png")} alt="" />
          </div>
          <span className="username">{user.name}</span>
          <span className="email">{user.email}</span>
        </div>
        <div className="option">
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
      <div className="body-list">
        <span>{detail.sentences}</span>
      </div>
      <hr />
      <div className="ket-body">
        <span>{dateStatus()}</span>
      </div>
      <hr />
      <div className="footer-detail">
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

                formData.append("mode", "status");
                formData.append("comment", statusComments);
                await PostComment(formData, detail.id)
                  .then(async (response) => {
                    if (response.status === 201) {
                      await updateForce();
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
                      bottom: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  });
              }
            }}
          >
            <i className="fa-solid fa-comment"></i>
            <span>{detail.total_comment}</span>
          </Link>
        </div>
        <div className="love">
          <Link
            onClick={(e) => {
              e.preventDefault();
              loveStatus(detail.id);
            }}
          >
            <i
              className={
                detail.love_status === 1
                  ? "fa-solid fa-heart active-love"
                  : "fa-solid fa-heart disable-love"
              }
            ></i>
            <span>{detail.total_love}</span>
          </Link>
        </div>
        <div className="view">
          <Link
            onClick={(e) => {
              e.preventDefault();
              Swal.fire("Views", "Times this Status was seen.", "info");
            }}
          >
            <i className="fa-solid fa-chart-simple"></i>
            <span>{detail.total_view}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PanelDetailStatus;
