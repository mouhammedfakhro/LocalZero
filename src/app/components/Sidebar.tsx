"use client";

import { NavigationItem } from "@/types";
import { faHome, faBars, faInbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation: NavigationItem[] = [
  {
    href: "/home",
    icon: faHome,
    name: "Home",
  },
  {
    href: "/tracker",
    icon: faBars,
    name: "Sustainability Tracker",
  },
  {
    href: "/inbox",
    icon: faInbox,
    name: "Inbox",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col bg-white h-screen border-r border-gray-200 transition-all duration-300 ease-in-out w-72">
      <div className="flex items-center flex-row p-4 border-b border-gray-200 space-x-2">
        <div className="flex justify-center items-center bg-green-600 py-0.5 px-1.5 rounded-md ">
          <h1 className="font-bold text-lg text-white">LZ</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">LocalZero</h2>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-5 px-4 py-3 rounded-lg transition-all
              ${
                pathname.startsWith(item.href)
                  ? "bg-green-100 font-semibold"
                  : "hover:bg-green-100"
              }
            `}
          >
            <FontAwesomeIcon
              icon={item.icon}
              className={`text-2xl  ${
                pathname.startsWith(item.href)
                  ? "text-green-700"
                  : "text-gray-700"
              }`}
            />
            <h1
              className={`${
                pathname.startsWith(item.href)
                  ? "text-green-700"
                  : "text-gray700"
              }`}
            >
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </aside>
  );
}
