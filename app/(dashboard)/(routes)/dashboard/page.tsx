"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, ImageIcon, FileCheck2, UserSearch, Mails, Linkedin, CircleArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Resume Bullet Points Generator",
    icon: FileCheck2,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/resumebullet"
  },
  {
    label: "Resume Profile Summary Generator",
    icon: UserSearch,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/resumesummary"
  },
  {
    label: "Cover Letter Generator",
    icon: Mails,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/coverletter"
  },
  {
    label: "Networking Message Generator",
    icon: Linkedin,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    href: "/networking"
  }
]
const DashboardPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Apply to your dream job in seconds!
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Applying to jobs shouldn't be a full-time job
        </p>
    </div>
    <div className="px-4 md:px-20 lf:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
            <CircleArrowRight className="w-10 h-7" />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage;
