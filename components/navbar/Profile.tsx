"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { signIn, signOut } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

const Profile = ({ session }: { session: User }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!session) {
    return (
      <button
        className="h-full rounded-lg bg-secondary-100 px-3 py-2 text-sm font-bold text-secondary-400 dark:bg-secondary-800 dark:text-secondary-300"
        onClick={() => signIn("github")}
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Image
        className="cursor-pointer rounded-full"
        height={40}
        width={40}
        src={session?.image}
        alt="User dropdown"
        onClick={() => setShowDropdown(!showDropdown)}
      />
      {showDropdown && (
        <div className="absolute right-0 z-10 mt-2 w-44 divide-y divide-secondary-300 rounded-lg bg-secondary-200 shadow dark:divide-secondary-700 dark:bg-secondary-800">
          <div className="px-4 py-3 text-sm">
            <div className="font-bold text-secondary-500 dark:text-secondary-200">
              {session?.name}
            </div>
            <div className="truncate font-medium text-secondary-400 dark:text-secondary-300">
              {session?.email}
            </div>
          </div>
          <ul className="text-sm">
            <li
              className="cursor-pointer border-b border-secondary-300 px-4 py-2 hover:bg-secondary-100 dark:border-secondary-700 dark:hover:bg-secondary-600"
              onClick={() => router.push(`/contributors/${session?.username}`)}
            >
              Profile
            </li>
            <li
              className="cursor-pointer px-4 py-2 hover:bg-secondary-100 dark:hover:bg-secondary-600"
              onClick={() => signOut()}
            >
              Sign out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
