"use client";
import { createContext, useContext, useState } from "react";

import { useAuth } from "./AuthContext";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getParts, getServices, getTasks } from "@/services/serviceServices";

const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
  const { token } = useAuth();
  // State Management
  const [mainServices, setMainServices] = useState([]);
  const [selectedMainService, setSelectedMainService] = useState(null);

  const [mainTasks, setMainTasks] = useState([]);
  const [selectedMainTask, setSelectedMainTask] = useState(null);

  const [mainParts, setMainParts] = useState([]);
  const [selectedMainPart, setSelectedMainPart] = useState(null);

  // mutations
  const { isPending: isGettingServices, mutateAsync: mutateGetServices } =
    useMutation({
      mutationFn: getServices,
    });

  const { isPending: isGettingTasks, mutateAsync: mutateGetTasks } =
    useMutation({
      mutationFn: getTasks,
    });

  const { isPending: isGettingParts, mutateAsync: mutateGetParts } =
    useMutation({
      mutationFn: getParts,
    });

  const getMainServices = async (ative = -1) => {
    try {
      const data = {
        token: token,
        active: ative,
      };
      const { data: response } = await mutateGetServices(data);
      if (response?.msg === 0) {
        setMainServices(response?.value || []);
        return;
      } else {
        toast.error(response?.msg_text);
        return;
      }
    } catch (error) {
      console.error("خطایی در دریافت اطلاعات رخ داده است:", error);
    }
  };

  const getMainTasks = async (id_service, active = -1) => {
    if (!id_service) {
      console.warn("No service ID provided for getMainTasks");
      return;
    }

    try {
      const data = {
        token: token,
        id_service: id_service,
        active: active,
      };
      const { data: response } = await mutateGetTasks(data);
      if (response?.msg === 0) {
        setMainTasks(response?.value || []);
        return;
      } else {
        toast.error(response?.msg_text);
        return;
      }
    } catch (error) {
      console.error("خطایی در دریافت اطلاعات رخ داده است:", error);
    }
  };

  const getMainParts = async (id_service, active = -1) => {
    if (!id_service) {
      console.warn("No service ID provided for getMainParts");
      return;
    }

    try {
      const data = {
        token: token,
        id_service: id_service,
        active: active,
      };
      const { data: response } = await mutateGetParts(data);
      if (response?.msg === 0) {
        setMainParts(response?.value || []);
        return;
      } else {
        toast.error(response?.msg_text);
        return;
      }
    } catch (error) {
      console.error("خطایی در دریافت اطلاعات رخ داده است:", error);
    }
  };

  return (
    <ServicesContext.Provider
      value={{
        mainServices,
        setMainServices,
        selectedMainService,
        setSelectedMainService,
        mainTasks,
        setMainTasks,
        selectedMainTask,
        setSelectedMainTask,
        mainParts,
        setMainParts,
        selectedMainPart,
        setSelectedMainPart,
        getMainServices,
        getMainTasks,
        getMainParts,
        isGettingServices,
        isGettingTasks,
        isGettingParts,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export default ServicesContext;

export const useServices = () => useContext(ServicesContext);

//
