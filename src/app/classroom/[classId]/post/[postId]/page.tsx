"use client";
import { Document, Page } from 'react-pdf'
import { callGetPost } from "@/apis/classAPI";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentAuthors,
  getCurrentPostAction,
} from "@/redux/slices/postSlice";
import { colors } from "@/utils/constant";
import { Avatar } from "antd";
import { callFetchUserById } from "@/apis/userAPI";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosHeart,
  IoIosHeartEmpty,
} from "react-icons/io";
import { UserOutlined } from "@ant-design/icons";
import { callCommentToPost, callHandleLikePost } from "@/apis/postAPI";
import Image from 'next/image'
import { pdfjs } from 'react-pdf';
import path from 'node:path';
import fs from 'node:fs';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/legacy/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();
// const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
// const pdfWorkerPath = path.join(pdfjsDistPath, 'build', 'pdf.worker.js');

// fs.copyFileSync(pdfWorkerPath, './dist/pdf.worker.js');
// import { pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface button {
  PREV: string;
  NEXT: string;
}

const buttonType: button = {
  PREV: "PREV",
  NEXT: "NEXT",
};

const PostDetails = (props: any) => {
  // console.log(props);
  const classId = props.params.classId;
  const postId = props.params.postId;
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.currentPost);
  const author = useSelector((state) => state.post.author);
  const media = useSelector((state) => state.post.currentPost?.medias);
  const user = useSelector((state) => state.account.user);
  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [mediaIndex, setMediaIndex] = useState(0);
  const [isUpdate, setIsUpdate] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  const textAreaRef = useRef(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<string>({ url: '' });
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }
  const fileObject = {
    url: '' as String | null,
  };

  useEffect(() => {
    if (media) {
      setFile({ url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/media/${media[mediaIndex].id}` });
      // fileObject.url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/media/${media[mediaIndex].id}`;
    }
  }, [mediaIndex, media]);

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);

  }
  const handleInput = (e) => {
    setTextAreaHeight("auto"); // Reset height to auto to ensure the correct new height is calculated
    const target = e.target;
    if (target.offsetHeight <= target.scrollHeight) setTextAreaHeight(`${target.scrollHeight}px`); // Set new height based on scroll height
  };

  const getPostDetails = async () => {
    const res = await callGetPost(postId);
    if (res?.id) {
      dispatch(getCurrentPostAction(res));
      const author = await callFetchUserById(res.authorId);
      dispatch(getCurrentAuthors(author));
      setIsUpdate(false);
    }

    console.log(res);
    // setPost(res);
  };

  useEffect(() => {
    getPostDetails();
  }, [isUpdate]);

  const handleImageSlider = (type: string) => {
    // console.log(type);
    setTimeout(() => {
      if (type === buttonType.PREV) {
        // console.log(0);
        if (mediaIndex === 0) {
          setMediaIndex(media.length - 1);
        } else {
          setMediaIndex(mediaIndex - 1);
        }
      } else {
        // console.log(1);
        if (mediaIndex === media.length - 1) {
          setMediaIndex(0);
        } else {
          setMediaIndex(mediaIndex + 1);
        }
      }
    }, 1000);
  };

  const handleLikePost = async () => {
    console.log(post.isLiked);
    let type: string;
    type = post.isLiked ? "unlike" : "like";
    const res = await callHandleLikePost(post.id, type);
    console.log(">>>check res: ", res);
    setIsUpdate(true);
  };

  const handleChangeCommentInput = (e) => {
    const value = e.target.value;
    setCommentInput(value);
  };

  const handleEnter = async (e) => {
    e.preventDefault();
    const res = await callCommentToPost(post.id, commentInput);
    console.log(res);
    console.log("press Enter")
    setCommentInput("");

  };

  return (
    <>
      <div
        className={"flex justify-center max-h-[78vh] mx-[2vw] my-5 rounded-2xl "}
        style={{ backgroundColor: `${colors.green_1}` }}
      >
        {post?.medias?.length > 0 && (
          <div className={"w-full  px-10 flex-col items-center"}>

            <div className={"my-auto  w-full flex justify-center h-full"}>
              {media[mediaIndex].type.includes("image") ? (
                <Image
                  alt="Author's avatar"
                  className={" mx-auto rounded-2xl"}
                  style={{
                    width: "80%",
                    minWidth: "80%",
                    maxWidth: "80%",
                    height: "60%",
                    minHeight: "60%",
                    maxHeight: "60%",
                  }}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/media/${media[mediaIndex].id}`}
                />
              ) : media[mediaIndex].type.includes("video") ? (
                <video
                  className={" mx-auto rounded-2xl"}
                  style={{
                    width: "80%",
                    minWidth: "80%",
                    maxWidth: "80%",
                    height: "60%",
                    minHeight: "300px",
                    // maxHeight: "60%",
                  }}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/media/stream/${media[mediaIndex].id}`}
                  controls
                />
              ) : media[mediaIndex].type.includes("pdf") ? (
                <div className='w-min h-full '>
                  <Document className={"h-full overflow-y-scroll"} file={file.url} onLoadSuccess={onDocumentLoadSuccess}>
                    {/* <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} canvasBackground='white' /> */}
                    {Array.from(
                      new Array(numPages),
                      (el, index) => (
                        <Page
                          renderTextLayer={false} renderAnnotationLayer={false} canvasBackground='white'
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                        />
                      ),
                    )}
                  </Document>
                  {/* <div>
                      Page {pageNumber} of {numPages}
                    </div> */}
                  {/* <div>
                      <p>
                        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                      </p>
                      <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                      >
                        Next
                      </button>
                    </div> */}
                </div>
              ) : (
                <p>Unsupported media type</p>
              )}
            </div>
            <div
              className={"flex mx-auto justify-center text-green_3 mt-4 text-lg"}
            >
              <button onClick={() => handleImageSlider(buttonType.PREV)}>
                <IoIosArrowBack />
              </button>
              <p className={"mx-3"}>
                {mediaIndex + 1} / {media.length}
              </p>
              <button onClick={() => handleImageSlider(buttonType.NEXT)}>
                <IoIosArrowForward />
              </button>
            </div>

          </div>
        )}
        <div className={"max-w-[800px] min-w-[30vw] min-h-[80vh] w-max overflow-auto px-10 py-10 pr-20"}>
          <div
            className="flex items-center mb-2 text-lg"
            style={{ color: `${colors.green_3}` }}
          >
            {/*<FaUser className="mr-2" />*/}
            <Avatar
              size={40}
              icon={<UserOutlined />}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/media/${author.avatarId}`}
              className="mr-3"
            />
            <p className="inline-block text-green-3">
              {author.lastName} {author.firstName}
            </p>
          </div>
          <h4
            className={"uppercase font-bold text-2xl text-center my-5"}
            style={{ color: `${colors.green_3}` }}
          >
            {post.title}
          </h4>
          <div className="">
            <div
              className={"text-lg text-justify inline-block"}
              dangerouslySetInnerHTML={{ __html: post.caption }}
            />


          </div>
          <div
            className=" justify-between"
            style={{
              bottom: "1rem",
              left: "1rem",
              width: "100%",
              padding: "20px",
              backgroundColor: `transparent`,
            }}
          >
            <div className="flex">
              {post.isLiked ? (
                <IoIosHeart
                  className={"w-6 h-6"}
                  style={{ color: `${colors.green_3}` }}
                  onClick={handleLikePost}
                />
              ) : (
                <IoIosHeartEmpty
                  className={"w-6 h-6"}
                  style={{ color: `${colors.green_3}` }}
                  onClick={handleLikePost}
                />
              )}
              <p className={"text-green_3 text-base ml-2"}>
                {post.numberOfLikes}
              </p>
            </div>
            <div className={"mt-2 flex"}>
              <Avatar
                size={40}
                icon={<UserOutlined />}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/media/${user.avatarId}`}
                className="mr-3"
              />
              <textarea
                ref={textAreaRef}
                value={commentInput}
                onInput={handleInput}
                className={
                  "w-full  bg-transparent rounded-3xl py-2 px-7 text-black placeholder-black outline-none"
                }
                style={{ border: `1px solid ${colors.green_3}`, height: textAreaHeight, overflow: "hidden" }}
                placeholder="Thêm bình luận..."
                onChange={(e) => handleChangeCommentInput(e)}
                // onKeyPress={}
                onKeyDown={(e) => e.key === "Enter" && handleEnter(e)}
              />
              {/* <textarea
                value={commentInput}
                placeholder={"Comment"}
                onChange={}
                onKeyPress={(e) => e.key === "Enter" && handleEnter()}
                className={
                  "w-4/5 bg-transparent rounded-3xl py-2 px-7 text-black placeholder-black outline-none"
                }
                style={{ border: `1px solid ${colors.green_3}` }}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetails;
