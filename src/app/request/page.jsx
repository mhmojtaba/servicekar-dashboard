"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AddRequest from "@/components/RequestService/Request";
import { useAuth } from "@/providers/AuthContext";

export default function Request() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) {
      return; // Wait for auth context to load
    }

    if (!token) {
      router.push("/login?redirect=/request");
      toast.error("لطفا وارد شوید");
    } else {
      setIsChecking(false);
    }
  }, [token, isLoading, router]);

  // Show loading state while checking authentication or redirecting
  if (isLoading || isChecking || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  return <AddRequest />;
}
