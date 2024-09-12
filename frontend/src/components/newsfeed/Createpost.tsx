import { createNewPostRequest, getTopics } from "@/api/newsfeed";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import style from "@/styles/modules/createPost.module.scss";
import { toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import { usePostStore } from "@/store/newFeed";
import type { IPost } from "@/api/newsfeed/model";

interface UserInfo {
  user?: {
    photo?: {
      path: string;
    };
  };
}

const CreatePost = (props: {
  userSession: any;
  groupId: string;
  tab?: string;
  updatePostArr: React.Dispatch<React.SetStateAction<IPost[]>> | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<File | null>(null);
  const [topics, setTopics] = useState<{ value: string; label: any }[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interestTopicId, setInterestTopicId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const imageRef = useRef<HTMLInputElement>(null);

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [curTheme, setCurTheme] = useState("");
  const router = useRouter();
  const t = useTranslations("CreatePost");
  const addPost = usePostStore((state) => state.addPost);

  useEffect(() => {
    if (props.userSession) {
      setUserInfo(props.userSession);
    }
  }, [props.userSession]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) setCurTheme(theme);
    if (!props.groupId) {
      fetchTopics();
    }
    setIsLoading(false);

    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme");
      if (theme) setCurTheme(theme);
    };
    window.addEventListener("themeChange", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener,
      );
    };
  }, []);
  const topicListRef = useRef(null);

  const fetchTopics = async (page = 1, search = "") => {
    setIsLoading(true);

    try {
      const response = await getTopics(page, search);

      if (response) {
        const newTopics = response["data"]["docs"].map((topic) => ({
          value: topic.id,
          label: topic.topicName,
        }));
        const uniqueTopics = [...topics, ...newTopics].filter(
          (topic, index, self) =>
            index === self.findIndex((t) => t.value === topic.value),
        );
        setTopics(uniqueTopics);
        setIsLoading(false);
        setHasNextPage(response["data"]["meta"]["hasNextPage"]);
      }
    } catch (error) {
      throwToast(t("error_fetch_topic"), "error");
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (hasNextPage) {
      setCurrentPage((prevState) => prevState + 1);
      fetchTopics(currentPage, searchTerm);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedImages([...uploadedImages, ...files]);
    }
  };

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
  };

  const removeImage = (index: number) => {
    const newUploadedImages = [...uploadedImages];
    newUploadedImages.splice(index, 1);
    if (imageRef.current) {
      imageRef.current.value = null || "";
    }
    setUploadedImages(newUploadedImages);
  };

  const enlargeImage = (image: File) => {
    setEnlargedImage(image);
  };

  const closeEnlarge = () => {
    setEnlargedImage(null);
  };

  const throwToast = (message: string, notiType: string) => {
    const notiConfig: ToastOptions = {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    const notify = () => {
      if (message !== "" && notiType === "success") {
        toast.success(message, notiConfig);
      } else if (message !== "" && notiType === "error") {
        toast.error(message, notiConfig);
      }
    };

    notify();
  };

  const submitPost = async () => {
    if (postText.trim() === "") {
      throwToast(t("please_enter_text"), "error");
      return;
    }

    if (!props.groupId && !selectedTopic) {
      throwToast(t("please_select_a_topic"), "error");
      return;
    }

    try {
      const postData = new FormData();
      postData.append("content", postText);
      uploadedImages.forEach((image) => {
        postData.append("images", image);
      });
      if (props.groupId) {
        postData.append("communityId", props.groupId);
      } else {
        postData.append("interestTopicId", interestTopicId);
      }
      const newFeed = await createNewPostRequest(postData);
      // Add new post to community/for-you feed
      if ((props.groupId || props.tab === "for_you") && props.updatePostArr) {
        props.updatePostArr(
          (prev: IPost[]) => [newFeed.data, ...prev] as IPost[],
        );
      }
      if (imageRef.current) {
        imageRef.current.value = null || "";
      }
      // addPost(newFeed.data as any);
      setShowModal(false);
      throwToast(t("post_create_success"), "success");
      setPostText("");
      setUploadedImages([]);
      setSelectedTopic(null);
    } catch (error) {
      console.log("error", error);
      throwToast(t("post_create_error"), "error");
    }
  };

  const handleTopicChange = (selectedOption: any) => {
    setSelectedTopic(selectedOption);
    setInterestTopicId(selectedOption.value);
  };

  const menuClass = `${isOpen ? " show" : ""}`;
  return (
    <div
      className="card w-100 shadow-xss border-0 px-4 py-3 mb-3 nunito-font"
      id={style["create-post"]}
    >
      <div
        className="card-body p-0 mb-2 position-relative"
        id={style["card-body"]}
      >
        <figure className="avatar position-absolute p-1 ms-2 mt-2 top-5">
          <Image
            src={userInfo?.user?.photo?.path ?? "/assets/images/user.png"}
            alt="Ảnh hồ sơ"
            width={30}
            height={30}
            className="shadow-sm rounded-circle w30"
          />
        </figure>
        <textarea
          maxLength={5000}
          onChange={(event) => {
            setPostText(event.target.value);
          }}
          value={postText}
          name="message"
          className="h100 w-100 rounded-3 p-3 ps-5 font-xss text-dark fw-400 border-light-md theme-dark-bg"
          placeholder={t("Whats_on_your_mind")}
          style={{ resize: "none" }}
        ></textarea>

        {uploadedImages.length > 0 && (
          <Box
            sx={{
              width: "100%",
              maxHeight: 500,
              overflow: "hidden",
            }}
          >
            <Masonry
              columns={uploadedImages.length > 3 ? 3 : uploadedImages.length}
            >
              {uploadedImages.slice(0, 6).map((image, index) => {
                console.log(image);
                return (
                  <div key={index} className={style["previewImage"]}>
                    <Image
                      security="restricted"
                      src={URL.createObjectURL(image)}
                      alt="Uploaded Image"
                      className={style["imagePreview"]}
                      layout="responsive"
                      width={100}
                      height={100}
                      objectFit="cover"
                      sizes={
                        image.size > 1000000
                          ? "(max-width: 500px) 100vw, 500px"
                          : "(max-width: 211px) 100vw, 211px"
                      }
                      onClick={() => enlargeImage(image)}
                    />
                    <i
                      className={`${style["remove-img"]} bi bi-x-circle-fill cursor-pointer`}
                      onClick={() => removeImage(index)}
                    ></i>
                  </div>
                );
              })}
            </Masonry>
          </Box>
        )}
      </div>
      {enlargedImage && (
        <div className={style["enlarged-image-modal"]} onClick={closeEnlarge}>
          <div
            className={style["enlarged-image-container"]}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={URL.createObjectURL(enlargedImage)}
              alt="Enlarged Image"
              width={500}
              height={500}
              className={style["enlarged-preview-image"]}
            />
            <button onClick={closeEnlarge} className={style["close-enlarge"]}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      )}
      <div className={`${style["footer"]} card-body p-0 mt-0`}>
        <label
          className="d-flex align-items-center font-xsss fw-600 ls-1 text-grey-700 text-dark pe-4 cursor-pointer"
          onClick={toggleUploadForm}
        >
          <i className="font-md text-success feather-image me-2"></i>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            id="imageUpload"
            hidden={!showUploadForm}
            max={20}
            className={style["imageUploadInput"]}
            ref={imageRef}
          />
          {t("Photo_Video")}
        </label>
        {!props.groupId && (
          <label
            ref={topicListRef}
            className={`${style["topic-list"]} theme-dark-bg`}
          >
            {isLoading && (
              <div className="text-center">
                <span className="spinner-border spinner-border-sm me-2"></span>
                {t("loading_topics")}
              </div>
            )}
            <Select
              options={topics}
              value={selectedTopic}
              onChange={handleTopicChange}
              placeholder={t("select_Topic")}
              isMulti={false}
              classNamePrefix={`${style["topic-select"]}`}
              onInputChange={(searchTerm) => {
                setTimeout(() => {
                  if (searchTerm.trim() !== "") {
                    setSearchTerm(searchTerm);
                    fetchTopics(1, searchTerm);
                  }
                }, 3000);
              }}
              onMenuScrollToBottom={handleScroll}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor:
                    curTheme === "theme-light" ? "#fff" : "#1a1237",
                  borderColor: "#f1f1f1",
                  borderWidth: "2px",
                  borderRadius: "5px",
                  boxShadow: "shadow-md",
                  fontSize: "15px",
                  cursor: "pointer",
                  color: "#111",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#e0e0e0" : "#fff",
                  color: state.isSelected ? "#333" : "#000",
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
                  fontSize: "15px",
                }),
                menu: (provided) => ({
                  ...provided,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }),
              }}
            />
          </label>
        )}
        <div
          className={`ms-auto pointer ${menuClass} ${style["create-post__btn"]}`}
        >
          <label
            id="submit"
            className="main-btn font-xsss fw-600 text-white card-body px-4 py-2 d-flex align-items-center justify-content-center cursor-pointer"
            onClick={submitPost}
          >
            <i className="rounded-3 font-xs text-white feather-edit-3"></i>
            {t("create_Post")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
