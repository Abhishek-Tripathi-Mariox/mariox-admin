import Cookies from "js-cookie";
import moment from "moment";
import { Upload as Uploader } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { S3Config } from "../../config";

export const authHeader = () => {
  const Token = Cookies.get("t_k");
  if (Token) {
    return {
      Authorization: `Bearer ${Token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

export const debounce = (func) => {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, 500);
  };
};

export const authHeaderUrlEncoded = () => {
  const Token = Cookies.get("t_k");
  if (Token) {
    return {
      Authorization: `Bearer ${Token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

export const getPaymentMode = (value) => {
  switch (value) {
    case "CREDIT_CARD":
      return "Credit Card";

    case "NET_BANKING":
      return "Net Banking";

    default:
      return value || "N/A";
  }
};

export const getYearList = () => {
  let arr = [];
  let currentYear = moment().format("YYYY");
  let previousYear = "2021";

  for (let index = previousYear; index <= currentYear; index++) {
    arr.push(index);
  }
  return arr.sort((a, b) => b - a);
};

export const uploadFileInAws = async (file) => {
  try {
    let uniqueId = uuidv4();

    //For more check here:- https://www.npmjs.com/package/@aws-sdk/lib-storage

    const parallelUploads3 = new Uploader({
      client: new S3Client({
        region: S3Config.Region,
        credentials: {
          accessKeyId: S3Config.AccessKey,
          secretAccessKey: S3Config.SecretKey,
        },
      }),
      params: {
        Bucket: S3Config.Bucket,
        Key: String(uniqueId) + file.name,
        Body: file,
      },
      queueSize: 4, // optional concurrency configuration
    });

    parallelUploads3.on("httpUploadProgress", () => {
      // console.log(progress);
    });

    let url = await parallelUploads3.done();
    // console.log(url, "S3 url");
    return { fileUrl: url?.Location };
  } catch (e) {
    // console.log(e);
  }
};
