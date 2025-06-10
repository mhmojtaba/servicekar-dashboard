"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import {
  addUpdateRequest,
  getRequests,
  getRequestsMain,
  getReviews,
} from "@/services/requestsServices";
import { toast } from "react-toastify";

const RequestsContext = createContext();

export const RequestsProvider = ({ children }) => {
  const { token } = useAuth();
  const [mainRequests, setMainRequests] = useState([]);
  const [requestsCount, setRequestsCount] = useState(null);

  const [operation_type, setOperation_type] = useState([]);
  const [status_requests, setStatus_requests] = useState([]);
  const [status_payment_online, setStatus_payment_online] = useState([]);
  const [array_type_payment, setArray_type_payment] = useState([]);
  const [requester_type, setRequester_type] = useState([]);
  const [service, setService] = useState([]);
  const [technician, setTechnician] = useState([]);
  const [zones, setZones] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [url, setUrl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { isPending: isGettingRequest, mutateAsync: mutateGetRequests } =
    useMutation({
      mutationFn: getRequests,
    });

  const {
    isPending: isGettingRequestsMain,
    mutateAsync: mutateGetRequestsMain,
  } = useMutation({
    mutationFn: getRequestsMain,
  });

  const { isPending: isUpdating, mutateAsync: mutateAddUpdateRequest } =
    useMutation({
      mutationFn: addUpdateRequest,
    });

  const { isPending: isGettingReviews, mutateAsync: mutateGetReviews } =
    useMutation({
      mutationFn: getReviews,
    });

  const addUpdateRequests = async (values) => {
    try {
      const data = {
        token,
        ...values,
        id: selectedRequest ? selectedRequest.id : 0,
      };
      const { data: response } = await mutateAddUpdateRequest(data);
      if (response?.msg === 0) {
        toast.success(response?.msg_text);
        setSelectedRequest(null);
        fetchRequests();
        return response;
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async (value) => {
    try {
      const data = {
        token: token,
        ...value,
      };
      const { data: response } = await mutateGetRequests(data);

      if (response?.msg === 0) {
        setMainRequests(response?.requests);
        setRequestsCount(response?.count);
        setUrl(response?.url);
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequestsMain = async () => {
    try {
      const { data: response } = await mutateGetRequestsMain(token);

      if (response?.msg === 0) {
        setOperation_type(response?.operation_type);
        setStatus_requests(response?.status_requests);
        setStatus_payment_online(response?.status_payment_online);
        setArray_type_payment(response?.array_type_payment);
        setRequester_type(response?.requester_type);
        setService(response?.service);
        setTechnician(response?.technician?.technicians);
        setZones(response?.zones);
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data: response } = await mutateGetReviews({
        token: token,
        order_id: selectedRequest.id,
      });
      if (response?.msg === 0) {
        setReviews(response?.reviews);
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequestsMain();
    fetchRequests();
  }, []);

  return (
    <RequestsContext.Provider
      value={{
        mainRequests,
        setMainRequests,
        requestsCount,
        selectedRequest,
        setSelectedRequest,
        isGettingRequest,
        isGettingRequestsMain,
        operation_type,
        status_requests,
        status_payment_online,
        array_type_payment,
        requester_type,
        service,
        technician,
        zones,
        addUpdateRequests,
        isUpdating,
        fetchRequests,
        fetchRequestsMain,
        reviews,
        fetchReviews,
        isGettingReviews,
        url,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => useContext(RequestsContext);
