"use client";
import { axios } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    status: "",
    password: "",
  });
  let inpRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is too large, maximum 5MB allowed.`);
        setImage(null);
      } else {
        setImage(file);
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) return;

    try {
      const formData = new FormData();
      formData.append("username", form.fullName);
      formData.append("email", form.email);
      formData.append("bio", form.status);
      formData.append("password", form.password);
      if (image) formData.append("file", image);

      const data = await axios.post("/auth/register", formData);
      showToast.success("Register successful");
    } catch (err) {
      showToast.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-md"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-1">
        Welcome
      </h2>
      <p className="text-gray-400 text-center mb-6">Sign up</p>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          placeholder="Full Name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1">
          Email address
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          placeholder="Email address"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1">
          Status <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="text"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          placeholder="Status (Optional)"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1">Password</label>
        <input
          type="text"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          placeholder="Password"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1">
          Picture <span className="text-gray-400">(Optional)</span>
        </label>

        <button
          type="button"
          onClick={() => inpRef.current?.click()}
          className="px-4 py-2 bg-green-400 text-black mb-2"
        >
          Upload
        </button>

        <input
          ref={inpRef}
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {image && (
          <div className="mt-3 relative">
            <Image
              width={350}
              height={350}
              alt="Uploaded"
              src={URL.createObjectURL(image)}
              className="rounded"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setError(null);
                if (inpRef.current) inpRef.current.value = "";
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded"
            >
              Remove
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-[#29A684] text-white py-2 rounded-lg transition"
      >
        Sign up
      </button>
      <p className="mt-6 text-center text-gray-400">
        already have an account?{" "}
        <Link href="/auth/login" className="text-white underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
