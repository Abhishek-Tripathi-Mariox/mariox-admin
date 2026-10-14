import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { authHeader, authHeaderUrlEncoded } from "../helper";

export const baseURI = import.meta.env.VITE_API_URL;

// Example POST method implementation:
export async function postEncodedData(url = "", data = {}) {
  // Default options are marked with *
  try {
    const response = await fetch(baseURI + url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}

export async function postFormData(url = "", data = {}) {
  // Default options are marked with *xx

  try {
    const response = await fetch(baseURI + url, {
      method: "POST",
      body: data,
    });
    return response.json();
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}

export async function postFormDataWithToken(url = "", data = {}) {
  // Default options are marked with *xx
  const Token = Cookies.get("t_k");

  try {
    const response = await fetch(baseURI + url, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${Token}`,
        Accept: "application/json",
      },
    });
    return response.json();
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}

export const verifyTwoFA = (payload) =>
  postRawData("admin/2fa/verify", payload);

export async function postRawData(url = "", data = {}) {
  // Default options are marked with *
  try {
    const response = await fetch(baseURI + url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: authHeader(),
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}

export async function getData(url = "", params = {}) {
  // Default options are marked with *
  try {
    let uri = new URL(baseURI + url);
    uri.search = new URLSearchParams(params).toString();
    const response = await fetch(uri, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: authHeader(),
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    return response.json();
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}
export async function getDataForDetails(url = "", params = {}) {
  // Default options are marked with *
  try {
    let uri = new URL(baseURI + url + `/${params?.id}`);
    const response = await fetch(uri, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: authHeader(),
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    return response.json();
  } catch (ex) {
    console.log(ex, "Error");
    toast.error(
      "*Check Network Connection and try again later for sub cat details..!!",
    );
  }
}

export async function deleteData(url = "", data = {}) {
  // Default options are marked with *
  try {
    var urlencoded = new URLSearchParams();
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];
        urlencoded.append(key, element);
      }
    }
    const response = await fetch(baseURI + url, {
      method: "DELETE",
      credentials: "same-origin",
      headers: authHeaderUrlEncoded(),
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: urlencoded,
    });
    return response.json();
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}
export async function deleteDataInUrl(url = "", data = {}) {
  // Default options are marked with *
  try {
    const Token = Cookies.get("t_k");
    const response = await fetch(baseURI + url + `/${data?.id}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: null,
    });
    return response.json();
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}

export async function putFormData(url = "", data = {}) {
  // Default options are marked with *
  try {
    const Token = Cookies.get("t_k");
    const response = await fetch(baseURI + url, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}

export async function putFormDataFile(url = "", formData) {
  try {
    const Token = Cookies.get("t_k");
    const response = await fetch(baseURI + url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Token}`,
        // ✅ DO NOT SET Content-Type manually
        // Let browser set 'multipart/form-data' boundary
      },
      body: formData, // ✅ Must be FormData instance
    });
    return response.json();
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}

export async function putEncodedData(url = "", data = {}) {
  // Default options are marked with *
  var urlencoded = new URLSearchParams();
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      urlencoded.append(key, element);
    }
  }
  try {
    const Token = Cookies.get("t_k");
    const response = await fetch(baseURI + url, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${Token}`,
        Accept: "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: urlencoded, // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}
export async function patchEncodedInUrl(url = "", data = {}) {
  // Default options are marked with *

  try {
    const Token = Cookies.get("t_k");
    const response = await fetch(baseURI + url + `/${data?.id}`, {
      method: "PATCH", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: null, // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}
export async function putRawData(url = "", data = {}) {
  // Default options are marked with *

  try {
    const Token = Cookies.get("t_k");
    const response = await fetch(baseURI + url, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
        Accept: "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}
export async function patchRawData(url = "", data = {}, other = {}) {
  // Default options are marked with *

  try {
    const Token = other?.token ? other?.token : Cookies.get("t_k");
    const response = await fetch(baseURI + url, {
      method: "PATCH", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
        Accept: "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (ex) {
    toast.error("*Check Network Connection and try again later..!!");
  }
}

export async function downloadFile(
  url = "",
  params = {},
  filename = "file.xlsx",
) {
  try {
    const Token = Cookies.get("t_k");

    // Construct query string
    const query = new URLSearchParams(params).toString();
    const fullUrl = `${baseURI}${url}?${query}`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
        Accept: "application/octet-stream",
      },
    });

    if (!response.ok) throw new Error("File download failed");

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (ex) {
    toast.error("*Download failed. Check network or server response.");
    console.error("Download error:", ex);
  }
}
