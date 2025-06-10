import http from "./httpservices";

export function getRequests(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_data",
    get_count: 1,
    type: "user",
  });
}

export function getRequestsMain(token) {
  return http.post("", {
    token: token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "main",
  });
}

export function addUpdateRequest(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_service_request",
    registered_by_type: "user",
    ...data,
  });
}

export function addFile(data) {
  const formData = new FormData();

  formData.append("class_name", "main");
  formData.append("function_name", "add_file");
  formData.append("token", data.token);
  formData.append("file", data.file);

  return http.post("", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function addReview(data) {
  return http.post("", {
    token: data.token,
    class_name: "reviews",
    cnt_group: "service",
    function_name: "review_add",
    rating: data.rating,
    text: data.text,
    order_id: data.order_id,
  });
}

export function getReviews(data) {
  return http.post("", {
    token: data.token,
    class_name: "reviews",
    cnt_group: "service",
    function_name: "review_load",
    order_id: data.order_id,
  });
}
