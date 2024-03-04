import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types";

export type User = {
  id?: number;
  name: string;
  status?: string;
  category?: string;
  description?: string;
  imgUrl?: string;
  updatedAt?: string;
  createdAt?: string;
};

export type Task = {
  taskId: number;
  name: string;
  status: string;
  category: string;
  description: string;
  imgUrl?: string;
  updatedAt?: string;
  createdAt?: string;
  tags?: string[];
  dueDate?: string;
  priority?: string;
};


export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: "page",
    label: "tasks",
  },
  {
    title: "Team",
    href: "/dashboard/employee",
    icon: "employee",
    label: "team",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "profile",
    label: "profile",
  },
  {
    title: "Login",
    href: "/",
    icon: "login",
    label: "login",
  },
];
