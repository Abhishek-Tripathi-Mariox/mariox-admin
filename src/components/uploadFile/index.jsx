import { forwardRef, useEffect, useState } from "react";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import { toast } from "react-toastify";
import { uploadFileInAws } from "../../services/helper";

const Upload = forwardRef(function (
  {
    dataHandler,
    imager = "",
    multiple = false,
    multipleImager,
    text,
    disabled,
  },
  ref
) {
  const [imge, setImge] = useState(imager);
  const [time, settime] = useState(0);
  const [isActive, setisactive] = useState(false);

  useEffect(() => {
    var interval;
    if (isActive && time < 100) {
      interval = setInterval(() => {
        // if (time < 100)
        settime((seconds) => (seconds < 99 ? seconds + 1 : seconds));
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const [multipleImage, setMultipleImage] = useState([]);

  useEffect(() => {
    setMultipleImage(multipleImager || []);
  }, [multipleImager]);

  const handleClick = async (event) => {
    setisactive(true);
    settime(0);
    if (event.target.multiple) {
      let files = event.target.files;
      if (
        Object.values(files).length <= 5 &&
        multipleImage.length + Object.values(files).length <= 5
      ) {
        let FilesS3URls;
        try {
          FilesS3URls = await Promise.all(
            Object.values(files).map(async (file) => {
              return uploadFileInAws(file);
            })
          );
          let filePaths = FilesS3URls.map((it) => it.fileUrl);
          setMultipleImage([...multipleImage, ...filePaths]);
          dataHandler(filePaths);
        } catch (error) {
          console.log(error, "S3 upload error");
          toast.error("Failed to upload images. ");
        }
        settime(100);
        setisactive(false);
      } else {
        toast.error("*You can upload mamimux 5 image.");
      }
    } else {
      uploadFileInAws(event.target.files[0])
        .then((data) => {
          console.log(data, "Data");
          dataHandler(data?.fileUrl);
          settime(100);
          setisactive(false);
          setImge(data?.fileUrl);
        })
        .catch((err) => {
          console.log(err, "error");
        });
    }
  };

  const handleRemoveItems = (index) => {
    setMultipleImage(multipleImage.filter((item, i) => i !== index));
    dataHandler(
      multipleImage.filter((item, i) => i !== index),
      "remove"
    );
  };

  return (
    <>
      <div
        className="upload-btn-wrapper upload-subcate-img"
        hidden={ref ? true : false}
      >
        <div className="upload-btn-">
          <button className="btn">
            <img
              alt=""
              height="70%"
              width="100%"
              // onClick={() => {
              //     console.log(fileInput.current, "Current");
              // }}
              src={
                imager ? imager : imge ? imge : "assets/images/upload-img.png"
              }
            />
            <p>Upload {text || "Image"} here</p>
          </button>
          <div>
            <input
              style={{ marginBottom: "20px" }}
              type="file"
              name="myfile"
              height="100%"
              width="100%"
              onChange={handleClick}
              multiple={multiple}
              ref={ref}
              disabled={disabled}
            />
            {time > 0 && isActive && (
              <Progress style={{ marginTop: "10px" }} percent={time} />
            )}
          </div>
        </div>
      </div>
      <div className="product-thum-img">
        {multipleImage &&
          multipleImage.map((data, i) => {
            return (
              <span key={i} className="position-relative">
                <img src={data} className="thumb-img" alt="" />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!disabled) {
                        handleRemoveItems(i);
                      }
                    }}
                    href="#"
                    className="remove-thum-img"
                  >
                    <img src="assets/images/reject.png" alt="" />
                  </button>
                )}
              </span>
            );
          })}
      </div>
    </>
  );
});

Upload.displayName = "Upload";
export default Upload;
