import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch, FiPlus, FiEdit, FiFileText, FiTrash2 } from "react-icons/fi";

const BeneficiaryCustomer = () => {
  const { backendurl, token } = useContext(AppContext);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getAllCustomers = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/customer/all`, {
        headers: { token },
      });
      if (data.success) {
        setCustomers(data.customers);
        setFilteredCustomers(data.customers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, [token]);

  useEffect(() => {
    let filtered = customers;
    if (search.trim()) {
      filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          (customer.email &&
            customer.email.toLowerCase().includes(search.toLowerCase())),
      );
    }
    setFilteredCustomers(filtered);
  }, [search, customers]);

  const handleDelete = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const { data } = await axios.delete(
          `${backendurl}/api/customer/${customerId}`,
          {
            headers: { token },
          },
        );
        if (data.success) {
          toast.success(data.message);
          getAllCustomers();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Beneficiary Customers
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage all your customers and their bills
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers"
                className="w-56 rounded-lg bg-[#0f1424] border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.1)] transition-all duration-300"
              />
            </div>
            <button
              onClick={() => navigate("/add-customer")}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 btn-press"
            >
              <FiPlus />
              Add Customer
            </button>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1424] animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-[#0b0f1a] text-gray-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-t border-white/5 table-row-hover"
                    >
                      <td className="px-5 py-4 text-white">{customer.name}</td>
                      <td className="px-5 py-4 text-gray-400">
                        {customer.email}
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        {customer.phone}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/update-customer/${customer._id}`)
                          }
                          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all duration-200 hover:scale-110"
                          title="Update customer"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() =>
                            navigate("/billing", { state: { customer } })
                          }
                          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 transition-all duration-200 hover:scale-110"
                          title="Create Bill"
                        >
                          <FiFileText />
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all duration-200 hover:scale-110"
                          title="Delete customer"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-sm text-gray-500"
                    >
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryCustomer;
