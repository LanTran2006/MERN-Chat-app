"use client";
import { showToast } from "@/app/utils/toast";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/user";
import { axios } from "@/app/utils/axios";




export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  let {storeInfo}=useAuthStore()
 const router = useRouter()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return;

    try {
      const data = await axios.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      if (data) {
        await axios.post('/api/login', data);
        storeInfo(data.user,data.accessToken);
        router.back();
        showToast.success('Login successful');
      }
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
        Welcome back
      </h2>
      <p className="text-gray-400 text-center mb-6">Sign in</p>

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
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          placeholder="Password"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-[#29A684] text-white py-2 rounded-lg transition"
      >
        Sign in
      </button>

      <p className="mt-6 text-center text-gray-400">
        you do not have an account?{" "}
        <Link href="/auth/register" className="text-white underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
