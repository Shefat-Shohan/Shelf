"use client";
import { SignedIn } from "@clerk/nextjs";
import React from "react";
import { Metadata } from "next";
import SideNav from "../components/Sidebar";
import { ThemeProvider } from "../components/ThemeProvider";

export default function DashBoardlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignedIn>
      <div className="flex">
        <div>
          <SideNav />
        </div>
        <div className="w-full overflow-x-scroll md:overflow-y-scroll lg:overflow-hidden h-screen">
          {children}
        </div>
      </div>
    </SignedIn>
  );
}
