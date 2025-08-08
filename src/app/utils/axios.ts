import { HTTP_METHOD } from "next/dist/server/web/http";
import { httpError, normalizePath, showToast } from "./toast";
import { useAuthStore } from "../store/user";



type CustomRequestInit = Omit<RequestInit, "method" | "body" | "credentials">;

async function http(
  url: string,
  method: HTTP_METHOD,
  body: any,
  others: CustomRequestInit = {}
) {
  const fullUrl = url.includes("api")
    ? url
    : process.env.NEXT_PUBLIC_API_URL + normalizePath(url);

  // Get token from store
  const token = useAuthStore.getState().accessToken;

  const isBodyAllowed =
    method !== "GET" &&
    method !== "DELETE" &&
    body !== undefined &&
    body !== null;

  const payload =
    body instanceof FormData
      ? body
      : isBodyAllowed
      ? JSON.stringify(body)
      : undefined;

  let requestInit: RequestInit;
  if (body instanceof FormData) {
    requestInit = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      ...others,
      body: payload,
      cache: "no-store",
    };
  } else {
    requestInit = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      ...others,
      body: payload,
      cache: "no-store",
    };
  }

  let data;
  try {
    const res = await fetch(fullUrl, requestInit);

    data = await res.json();

    if (!res.ok) {
      throw new httpError(data.message || "Error", res.status);
    }

    return data;
  } catch (err) {
    const isClient = typeof window !== "undefined";
    if (isClient && err instanceof httpError) {
      if (err.statusCode == 401) {
        //window.location.href = "/auth/logout";
      }
      showToast.error(err);
    } else {
      console.error(err);
    }
    return { ...data, isErr: true };
  }
}

// Exported api mimicking axios methods with proper typing
export const axios = {
  get<T = any>(url: string, headers?: CustomRequestInit) {
    return http(url, "GET", null, headers) as Promise<T>;
  },
  post<T = any>(url: string, body?: any, headers?: CustomRequestInit) {
    return http(url, "POST", body, headers) as Promise<T>;
  },
  put<T = any>(url: string, body?: any, headers?: CustomRequestInit) {
    return http(url, "PUT", body, headers) as Promise<T>;
  },
  patch<T = any>(url: string, body?: any, headers?: CustomRequestInit) {
    return http(url, "PATCH", body, headers) as Promise<T>;
  },
  delete<T = any>(url: string, headers?: CustomRequestInit) {
    return http(url, "DELETE", null, headers) as Promise<T>;
  },
};
