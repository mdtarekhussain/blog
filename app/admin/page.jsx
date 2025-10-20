"use client";
import { useAuth } from "/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // যদি ইউজার না থাকে → login এ পাঠাও
      if (!user) {
        router.push("/login");
      }
      // যদি ইউজার থাকে কিন্তু অ্যাডমিন না হয় → home এ পাঠাও
      else if (user.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Checking admin access...</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome, Admin {user.name} 👑</h1>
      <p>This is the protected admin panel.</p>
    </div>
  );
}
