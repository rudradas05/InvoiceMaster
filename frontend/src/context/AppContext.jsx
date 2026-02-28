import { createContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendurl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"));
  const [userData, setUserData] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [items, setItems] = useState([]);
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);

  // Ref to avoid stale closure in interceptor
  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Axios interceptor for auto-logout on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          error.response.status === 401 &&
          tokenRef.current
        ) {
          // Token expired or invalid — auto logout
          setToken(false);
          setIsLoggedin(false);
          setUserData(false);
          setItems([]);
          setBills([]);
          setCategories([]);
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Category management
  const getCategories = useCallback(async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/category/all", {
        headers: { token },
      });
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      // 401 handled by interceptor
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    }
  }, [token, backendurl]);

  const addCategory = async (name) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/category/add",
        { name },
        { headers: { token } },
      );
      if (data.success) {
        toast.success("Category added");
        getCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status !== 401) toast.error(error.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/category/delete",
        { categoryId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success("Category deleted");
        getCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status !== 401) toast.error(error.message);
    }
  };

  const loadUserData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/get-user-data", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      if (error.response?.status !== 401) toast.error(error.message);
    }
  }, [token, backendurl]);

  const verification_status_user = async () => {
    if (userData && userData.IsAccountVerified === true) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

  const getAllItems = useCallback(async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/all-items", {
        headers: { token },
      });
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (error) {
      if (error.response?.status !== 401) toast.error(error.message);
    }
  }, [token, backendurl]);

  const getAllBills = useCallback(async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/all-bill", {
        headers: { token },
      });
      if (data.success) {
        setBills(data.bills || []);
      }
    } catch (error) {
      if (error.response?.status !== 401) toast.error(error.message);
    }
  }, [token, backendurl]);

  const downloadBillPDF = useCallback(
    async (billId) => {
      try {
        const response = await axios.get(
          `${backendurl}/api/user/bills/${billId}/pdf`,
          {
            responseType: "blob",
            headers: { token },
          },
        );

        if (response.data instanceof Blob) {
          const fileURL = URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = fileURL;
          link.download = `bill_${billId}.pdf`;
          link.click();
        } else {
          throw new Error("PDF data is not valid.");
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          toast.error("Error downloading PDF. Please try again.");
        }
      }
    },
    [token, backendurl],
  );

  useEffect(() => {
    if (token) {
      loadUserData();
      getAllItems();
      getAllBills();
      getCategories();
    }
  }, [token, loadUserData, getAllItems, getAllBills, getCategories]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedin(true);
    } else {
      localStorage.removeItem("token");
      setIsLoggedin(false);
    }
  }, [token]);

  const logout = useCallback(() => {
    setToken(false);
    setIsLoggedin(false);
    setUserData(false);
    setItems([]);
    setBills([]);
    setCategories([]);
    localStorage.removeItem("token");
  }, []);

  const value = {
    token,
    setToken,
    backendurl,
    isLoggedin,
    setIsLoggedin,
    currencySymbol,
    userData,
    loadUserData,
    setUserData,
    items,
    setItems,
    getAllItems,
    downloadBillPDF,
    bills,
    setBills,
    getAllBills,
    categories,
    getCategories,
    addCategory,
    deleteCategory,
    logout,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
