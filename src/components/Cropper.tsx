"use client";

import {useRef, useState} from "react";
import AvatarEditor from "react-avatar-editor";
import {Modal, Slider} from "antd";
import {callChangeAvatar} from "@/apis/userAPI";
import {useDispatch, useSelector} from "react-redux";
import {doGetAccountAction} from "@/redux/slices/accountSlice";
// import "antd/dist/antd.css";

const boxStyle = {
  width: "350px",
  height: "350px",
  display: "flex",
  flexFlow: "column",
  justifyContent: "center",
  alignItems: "center",
  // paddingTop: "5px",
};
const modalStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const CropperModal = ({ src, modalOpen, setModalOpen, setPreview }) => {
  const [slideValue, setSlideValue] = useState(10);
  const cropRef = useRef(null);
  const dispatch = useDispatch();

  const handleSave = async () => {
    if (cropRef) {
      const dataUrl = cropRef.current.getImage().toDataURL();
      console.log(dataUrl.slice(22));
      const result = await fetch(dataUrl);
      const blob = await result.blob();
      await setPreview(URL.createObjectURL(blob));
      let newFile = new File([blob], "newAvatar.jpg");
      const formData = new FormData();
      formData.append("file", newFile);
      const res = await callChangeAvatar(formData);
      dispatch(doGetAccountAction(res));
      // console.log(res);
      setModalOpen(false);
    }
  };

  return (
    <Modal
      style={modalStyle}
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={null}
    >
      <div style={boxStyle}>
        <AvatarEditor
          ref={cropRef}
          image={src}
          style={{ width: "70%", height: "70%", marginTop: "10px" }}
          border={50}
          borderRadius={150}
          color={[0, 0, 0, 0.72]}
          scale={slideValue / 10}
          rotate={0}
        />

        {/* Ant Design Slider */}
        <Slider
          min={10}
          max={50}
          tooltip={{ formatter: null }}
          style={{
            margin: "10px auto",
            width: "80%",
            // color: "cyan",
          }}
          defaultValue={slideValue}
          onChange={(value) => setSlideValue(value)}
        />
        <div
          style={{
            display: "flex",
            padding: "10px",
            // border: "3px solid white",
            // background: "black",
          }}
        >
          <button
            onClick={() => setModalOpen(false)}
            className={
              "border-[1px] border-gray-400 text-gray-400 rounded py-1 mr-3 w-24"
            }
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={"bg-blue_5 text-blue_6 rounded py-1 w-24"}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Cropper = ({ imgSrc }) => {
  // console.log("check img: ", imgSrc);
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef(null);
  const user = useSelector((state) => state.account.user);

  const handleInputClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleImgChange = (e) => {
    setSrc(URL.createObjectURL(e.target.files[0]));
    setModalOpen(true);
  };

  return (
    <>
      {/*<header>*/}
      {/*  <h1>React Avatar Cropper</h1>*/}
      {/*  <hr />*/}
      {/*</header>*/}
      <div className="container max-w-full rounded bg-blue_1 h-full flex items-center justify-center flex-col">
        <CropperModal
          modalOpen={modalOpen}
          src={src}
          setPreview={setPreview}
          setModalOpen={setModalOpen}
        />
        <div className="img-container">
          <img
            src={
              // preview ||
              // "https://www.signivis.com/img/custom/avatars/member-avatar-01.png"
              imgSrc
            }
            alt=""
            className={
              "2xl:w-44 2xl:h-44 xl:w-24 xl:h-24 lg:w-24 lg:h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 2xl:mb-2 mb-1"
            }
            // width="200"
            // height="200"
            style={{
              borderRadius: "50%",
              // border: "2px solid black",
              // height: "200px",
              // width: "200px",
              margin: "auto",
              // marginBottom: "10px",
            }}
          />
        </div>
        <p
          className={
            "text-center font-semibold 2xl:text-lg text-sm 2xl:mb-2 mb-1"
          }
        >
          {user.lastName + " " + user.firstName}
        </p>
        <a
          href="/"
          onClick={handleInputClick}
          className={
            "bg-[#95daf2] text-blue_5 2xl:py-2 2xl:px-6 rounded mx-auto block w-[60%] text-center text-sm py-1 px-4"
          }
        >
          {/*<FcAddImage className="add-icon" />*/}
          Choose avatar
        </a>
        {/*<small>Click to select image</small>*/}
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImgChange}
          style={{ display: "none" }}
        />
      </div>
      {/*<img*/}
      {/*  src={*/}
      {/*    preview ||*/}
      {/*    "https://www.signivis.com/img/custom/avatars/member-avatar-01.png"*/}
      {/*  }*/}
      {/*  width="200"*/}
      {/*  height="200"*/}
      {/*  style={{ borderRadius: "50%", border: "2px solid black" }}*/}
      {/*/>*/}

      {/*<footer>*/}
      {/*  <hr />*/}
      {/*  <a href="https://github.com/mrAJAY1">*/}
      {/*    <AiFillGithub />*/}
      {/*    &#160; Github*/}
      {/*  </a>*/}
      {/*</footer>*/}
    </>
  );
};

export default Cropper;
