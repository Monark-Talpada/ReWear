import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { axiosInstance } from "../lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Package, Tag, Layers, Ruler, Star, Eye } from "lucide-react";

const ItemPage = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [otherItems, setOtherItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/item/${itemId}`);
        setItem(res.data.item);

        // Fetch other items (excluding current)
        const allRes = await axiosInstance.get("/item");
        const filtered = allRes.data.listedItems.filter(
          (i) => i._id !== itemId
        );
        setOtherItems(filtered);
      } catch (err) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const LoadingSkeleton = () => (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <Skeleton className="w-full lg:w-96 h-80 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) return <LoadingSkeleton />;

  if (!item)
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Alert className="max-w-md mx-auto">
          <Package className="h-4 w-4" />
          <AlertDescription>
            Item not found. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    );

  const getStatusVariant = (status) => {
    switch (status) {
      case "available":
        return "default";
      case "sold":
        return "destructive";
      case "reserved":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getConditionIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
        return <Star className="h-3 w-3 text-yellow-500" />;
      case "good":
        return <Star className="h-3 w-3 text-green-500" />;
      default:
        return <Eye className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Main Item Details */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-2/5 bg-muted/30">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-80 lg:h-96 object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 lg:p-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">
                      {item.title}
                    </h1>
                    <Badge
                      variant={getStatusVariant(item.status)}
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.category && (
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Category</p>
                        <p className="text-sm text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.type && (
                    <div className="flex items-center gap-3">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Type</p>
                        <p className="text-sm text-muted-foreground">
                          {item.type}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.size && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Size</p>
                        <p className="text-sm text-muted-foreground">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.condition && (
                    <div className="flex items-center gap-3">
                      {getConditionIcon(item.condition)}
                      <div>
                        <p className="text-sm font-medium">Condition</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.condition}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Items Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Other Items</h2>
        </div>

        {otherItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                No other items available at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {otherItems.map((other) => (
              <Card
                key={other._id}
                onClick={() => navigate(`/item/${other._id}`)}
                className="w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={other.imageUrl}
                    alt={other.title}
                    className="w-full h-40 object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold
      ${
        other.status === "available"
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-600"
      }`}
                  >
                    {other.status || "Unknown"}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">
                    {other.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {other.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {other.tags &&
                      other.tags.length > 0 &&
                      other.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="gap-1 bg-gray-600/40"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemPage;
