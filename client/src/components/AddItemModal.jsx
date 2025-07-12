import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

const AddItemModal = ({ trigger, onItemAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, type, size, condition } = formData;
    if (!title || !description || !category || !type || !size || !condition) {
      toast.error("All fields are required");
      return;
    }

    if (!imageFile) {
      toast.error("Item image is required");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "tags") {
        form.append("tags", JSON.stringify(value));
      } else {
        form.append(key, value);
      }
    });
    form.append("image", imageFile);

    try {
      setLoading(true);
      const res = await axiosInstance.post("/item/create", form);
      if (onItemAdded) onItemAdded(res.data.item);
      toast.success("Item Add successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create item";
      toast.error(errorMessage);
    } finally {
      setImageFile(null);
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger disabled={loading} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            Add New Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                placeholder="e.g. Denim Jacket"
                required
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="category">Category</Label>
              <Input
                name="category"
                id="category"
                placeholder="e.g. Clothing"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="type">Type</Label>
              <Input
                name="type"
                id="type"
                placeholder="e.g. Men's Wear"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="size">Size</Label>
              <Input
                name="size"
                id="size"
                placeholder="e.g. M / L / XL"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="condition">Condition</Label>
              <Input
                name="condition"
                id="condition"
                placeholder="e.g. Gently Used"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Description</Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Tell us more about the item..."
              required
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="image">Item Image</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md mt-2 border"
              />
            )}
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Item"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
