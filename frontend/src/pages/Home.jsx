import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Create Bill",
      description: "Generate a new invoice for a customer",
      icon: ShoppingCartIcon,
      path: "/billing",
      primary: true,
    },
    {
      title: "Add Item",
      description: "Add products to your inventory",
      icon: PlusCircleIcon,
      path: "/add-items",
    },
    {
      title: "View Bills",
      description: "Browse and manage past invoices",
      icon: DocumentTextIcon,
      path: "/all-bills",
    },
    {
      title: "Inventory",
      description: "Track stock and pricing",
      icon: ArchiveBoxIcon,
      path: "/all-items",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Manage billing, inventory, and transactions
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <button
                key={index}
                onClick={() => navigate(card.path)}
                className={`group flex items-start gap-4 rounded-xl border p-6 text-left transition-all duration-300 hover-lift ${
                  card.primary
                    ? "border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10"
                    : "border-white/10 bg-[#0f1424] hover:bg-white/5 hover:border-white/20"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 ${
                    card.primary
                      ? "bg-cyan-500 text-black group-hover:shadow-lg group-hover:shadow-cyan-500/30"
                      : "bg-white/10 text-gray-300 group-hover:bg-white/15"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h3
                    className={`text-base font-semibold ${
                      card.primary ? "text-white" : "text-gray-200"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {card.description}
                  </p>
                </div>

                <span className="text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-300 mt-1">
                  &rarr;
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
