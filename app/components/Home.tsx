"use client"
import React from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BG from "@/public/shelf-bg.png";
import Image from "next/image";
export default function Home() {
  const { user } = useUser();
  return (
    <div className="bg-[#FEF5F6] flex flex-col-reverse w-full h-full md:flex  md:justify-between lg:flex-row lg:items-center">
      <div className="lg:px-40 p-10 md:py-32">
        <h3 className="text-[16px] font-semibold text-[#8A43FC]"> SHELF</h3>
        <h1 className="tracking-wide lg:text-6xl lg:leading-[70px] font-semibold capitalize text-3xl">
          Discover, Track & Enjoy Your Reading Journey
        </h1>
        <p className="py-4">
          Dive into a seamless reading experience! Organize your favorite books,
          track your progress effortlessly, and stay motivated with an intuitive
          reading status system. Whether you're planning your next read,
          currently immersed in a book, or celebrating a finished one—your
          personal book list keeps everything in one place.
        </p>
        {user ? (
          <Button>
            <Link href={"/dashboard"}>Go back Dashbord</Link>
          </Button>
        ) : (
          <Button>
            <Link href={"/sign-in"}>Get Started</Link>
          </Button>
        )}
      </div>
      <Image
        src={BG}
        alt="bg"
        className="lg:h-full object-cover md:h-1/2 h-[200px]"
      />
    </div>
  );
}
