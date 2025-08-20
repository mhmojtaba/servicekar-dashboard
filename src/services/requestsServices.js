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
    type: "user",
  });
}

export function addUpdateRequest(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_service_request",
    registered_by_type: "user",
    type: "user",
    ...data,
  });
}

export function cancelRequest(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "update_status",
    order_id: data.order_id,
    status: 2, // لغو شده
    type: "user",
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
    type: "user",
  });
}

export function getReviews(data) {
  return http.post("", {
    token: data.token,
    class_name: "reviews",
    cnt_group: "service",
    function_name: "review_load",
    order_id: data.order_id,
    type: "user",
  });
}

export function getDataWithMobile(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "get_with_mobile",
    mobile: data.mobile,
    type: "user",
  });
}

export function getByBarcode(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "get_by_barcode",
    barcode: data.barcode,
    type: "user",
  });
}

// get request data with barcode
export function getRequestDataWithBarcode(barcode) {
  return http.post("", {
    token: "",
    class_name: "requests",
    cnt_group: "service",
    function_name: "barcode_scanner_api",
    barcode: barcode,
  });
}

export function getInvoiceData(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "get_invoice_details",
    order_id: data.order_id,
    type: "user",
  });
}
