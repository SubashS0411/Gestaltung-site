"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import DashboardSidebar from "@/components/dashboard/sidebar";
import Assistant from "@/components/dashboard/assistant";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/auth");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-[#050505] relative">
            <DashboardSidebar />
            <main className="ml-[240px] mr-[320px] min-h-screen">
                {children}
            </main>
            <Assistant />
        </div>
    );
}
