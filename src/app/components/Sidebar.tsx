"use client";

import { NavigationItem } from "@/types";
import { faHome, faBars, faInbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  const userId = 1;

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await axios.get(`/api/getUnreadMessages?userId=${userId}`);
        setTotalUnreadMessages(res.data.length);
      } catch (error) {
        console.error("Failed to fetch messages: ", error);
      }
    };

    fetchUnreadMessages();

    const interval = setInterval(() => {
      fetchUnreadMessages();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
          <div key={item.href}>
            <Link
              href={item.href}
              className={`
    relative flex items-center gap-5 px-4 py-3 rounded-lg transition-all
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
              <div className="flex items-center justify-between w-full">
                <h1
                  className={`${
                    pathname.startsWith(item.href)
                      ? "text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </h1>

                {(item.name === "Inbox" && totalUnreadMessages > 0) && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {totalUnreadMessages}
                  </span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
}
