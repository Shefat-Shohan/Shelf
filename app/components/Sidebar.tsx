import {
  ChevronFirst,
  ChevronLast,
  LayoutDashboard,
  LibraryBig,
  LineChart,
  MessageSquare,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { sidebarMenu } from "@/data";
export default function SideNav() {
  const path = usePathname();
  useEffect(() => {}, [path]);
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  // resize the sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width:768px)").matches) {
        setExpanded(false);
        setIsMobile(true);
      } else {
        setExpanded(true);
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className="h-screen w-full">
      <nav className="h-full border-r">
        <motion.div
          className={`h-full p-4 flex flex-col justify-between ${
            expanded ? "" : "items-center"
          }`}
          initial={{ width: expanded ? 220 : 70 }}
          animate={{ width: expanded ? 220 : 70 }}
          transition={{ duration: 0.1 }}
        >
          {/* logo goes here */}
          <div className="flex items-center justify-between gap-6">
            <motion.div
              className={`flex items-center ${expanded ? "block" : "hidden"}`}
              initial={{ opacity: expanded ? 1 : 0 }}
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={"/"} className="text-2xl text-foreground">SHELF</Link>
            </motion.div>
            {!isMobile && (
              <div
                className="cursor-pointer"
                onClick={() => setExpanded((current) => !current)}
              >
                {expanded ? (
                  <ChevronFirst className="size-6" />
                ) : (
                  <ChevronLast className="size-6" />
                )}
              </div>
            )}
          </div>

          {/* link goes here */}
          <div className="flex flex-col gap-2">
            {sidebarMenu.map((menu, index) => (
              <Link
                onClick={() => {
                  if (window.innerWidth <= 360) {
                    setExpanded(false);
                  }
                }}
                href={menu.path}
                key={index}
                className={`relative flex gap-2.5 items-center py-2 px-3 rounded my-1 font-medium cursor-pointer transition-colors ${
                  path == menu.path && "bg-[#8A43FC] text-white"
                }`}
              >
                <menu.icon className="size-4" />
                <motion.span
                  className={`text-sm whitespace-nowrap ${
                    expanded ? "w-full" : "hidden"
                  }`}
                  initial={{ opacity: expanded ? 1 : 0 }}
                  animate={{ opacity: expanded ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {menu.name}
                </motion.span>
              </Link>
            ))}
          </div>
          {/* footer */}
          <div
            className={`border-t flex items-center justify-between py-3 border-white/15`}
          >
            {expanded ? (
              <motion.div
                initial={{ opacity: expanded ? 1 : 0 }}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 items-center"
              >
                <span className="text-sm whitespace-nowrap">
                  Manage Account
                </span>
                <UserButton />
              </motion.div>
            ) : (
              <UserButton />
            )}
          </div>
        </motion.div>
      </nav>
    </aside>
  );
}
