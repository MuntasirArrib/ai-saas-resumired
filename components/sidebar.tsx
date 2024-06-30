"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, FileCheck2, Mails, Settings, Linkedin, UserSearch } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FreeCounter } from "@/components/free-counter";


const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"]
})

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Resume Bullet Points Generator",
        icon: FileCheck2,
        href: "/resumebullet",
        color: "text-violet-500",
    },
    {
        label: "Resume Profile Summary Generator",
        icon: UserSearch,
        href: "/resumesummary",
        color: "text-pink-700",
    },
    {
        label: "Cover Letter Generator",
        icon: Mails,
        href: "/coverletter",
        color: "text-emerald-700",
    },
    {
        label: "Networking Message Generator",
        icon: Linkedin,
        href: "/networking",
        color: "text-blue-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
];

interface SidebarProps {
    apiLimitCount: number;
    isPro: boolean;
};

const  Sidebar = (
    { apiLimitCount = 0,
      isPro = false,
}: SidebarProps) => {
    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-20 h-20">
                        <Image
                            fill
                            alt="Logo"
                            src="/logo.png"
                        />
                    </div>
                    <h1 className={cn("text-2xl font-bold",montserrat.className)}>
                        Resumired
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}>
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("w-5 h-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <FreeCounter
                isPro={isPro}
                apiLimitCount={apiLimitCount}
            />
        </div>
    );
}

export default Sidebar;