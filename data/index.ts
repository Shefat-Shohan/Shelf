import {
  AudioLines,
  BrainCircuit,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Recycle,
  Shield,
} from "lucide-react";

export const sidebarMenu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Recycle Bin",
    icon: Recycle,
    path: "/dashboard/recycle-bin",
  },
  {
    name: "Reports & Analytics",
    icon: LineChart,
    path: "#",
  },
  {
    name: "Upgrades",
    icon: Shield,
    path: "#",
  },
];

export const genres = [
  {
    id: 1,
    genre: "Fiction",
  },
  {
    id: 2,
    genre: "Non-Fiction",
  },
  {
    id: 3,
    genre: "Fantasy",
  },
  {
    id: 4,
    genre: "Mystery",
  },
  {
    id: 5,
    genre: "Self-Help",
  },
  {
    id: 6,
    genre: "Novel",
  },
];
export const bookStatus = [
  {
    id: 1,
    status: "To Read",
  },
  {
    id: 2,
    status: "Reading",
  },
  {
    id: 3,
    status: "Finished",
  },
];

export const prompts =
  "Please generate a concise and insightful summary for the book titled";
