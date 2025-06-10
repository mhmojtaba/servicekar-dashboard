import http from "./httpservices";

// service
export function getServices(data) {
  return http.post("", {
    token: data.token,
    class_name: "main",
    cnt_group: "service",
    function_name: "service_data",
    search_input: data.search_input || "",
    ...data,
  });
}

// tasks
export function getTasks(data) {
  return http.post("", {
    token: data.token,
    class_name: "tasks",
    cnt_group: "service",
    function_name: "tasks_data",
    search_input: data.search_input || "",
    id_service: data.id_service,
    ...data,
  });
}

// parts

export function getParts(data) {
  return http.post("", {
    token: data.token,
    class_name: "parts",
    cnt_group: "service",
    function_name: "parts_data",
    search_input: data.search_input || "",
    id_service: data.id_service,
    ...data,
  });
}
