import axios from "axios";

const getBaseUrl = () => {
  const isBrowser = typeof window !== "undefined";
  const apipath = "/serviskar_api/";

  if (process.env.NODE_ENV !== "development") {
    return isBrowser
      ? window.location.origin + apipath
      : `http://localhost:3000${apipath}`;
  } else {
    return process.env.NEXT_PUBLIC_BASE_API_URL_HOST;
  }
};

const app = axios.create({
  baseURL: getBaseUrl(),
});

const http = {
  get: app.get,
  post: app.post,
  put: app.put,
  delete: app.delete,
  patch: app.patch,
};

export default http;

// import axios from "axios";
// const getBaseUrl = () => {
//   if (typeof window !== "undefined") {
//     const hostname = window.location.origin;
//     const apipath = "/noroclinic_api";
//     return hostname + apipath;
//   }
// };

// const app = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_API_URL_HOST, // http://192.168.100.208/saha03/serviskar/serviskar_api
//   // baseURL: `http://oh2.ir/serviskar_api`, // http://oh2.ir/serviskar_api
//   // baseURL: getBaseUrl(),
// });

// const http = {
//   get: app.get,
//   post: app.post,
//   put: app.put,
//   delete: app.delete,
//   patch: app.patch,
// };

// export default http;
