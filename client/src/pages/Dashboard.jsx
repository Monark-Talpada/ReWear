import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { authApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "../components/Navbar";
import NoData from "../components/NotData";
import { Button } from "../components/ui/button";
import AddItemModal from "../components/AddItemModal";
import { axiosInstance } from "../lib/axios";
import "keen-slider/keen-slider.min.css";
import Carousel from "../components/Carousel";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const { user } = useAuth();
  const [listedItems, setListedItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axiosInstance.get("/item");
        setListedItems(res.data.listedItems);
      } catch (err) {
        console.error("Failed to load items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8  p-8 rounded-xl shadow-md border border-gray-200">
          <div className="relative">
            <img
              src={user?.profileImage}
              alt="Profile"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border  shadow-sm"
            />
          </div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Role: {user?.role}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {user?.points} Points
              </span>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <section>
          <div className="flex justify-between mb-2">
            <h3 className="text-xl font-semibold mb-3">My Listings</h3>
            <div className="">
              <AddItemModal
                trigger={<Button>Add Item</Button>}
                onItemAdded={(newItem) =>
                  setListedItems((prev) => [newItem, ...prev])
                }
              />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : listedItems.length > 0 ? (
            listedItems.length > 3 ? (
              <Carousel items={listedItems} />
            ) : (
              <div className=" gap-4">
                {listedItems.map((item) => (
                  <Link to={`/item/${item._id}`}>
                    <Card
                      key={item._id}
                      onClick={() => navigate(`/item/${item._id}`)}
                      className="w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-40 object-cover "
                      />
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800 truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )
          ) : (
            <NoData message="No items listed" />
          )}
        </section>

        {/* Purchases Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3">My Purchases</h3>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : purchasedItems.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {purchasedItems.map((item) => (
                <Card
                  key={item._id}
                  className="rounded-xl p-3 hover:shadow-md transition"
                >
                  <img
                    src={item.imageUrl}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <h4 className="text-md font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <NoData message="No items found" />
          )}
        </section>
      </div>
    </>
  );
};

export default Dashboard;
