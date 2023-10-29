"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { status } = useSession();

  // Check if a user signed in
  const isSignedIn = () => {
    if (status == "authenticated") {
      return (
        <div className="col-start-2 col-end-3 text-right">
          <Link
            className="mr-5 text-right text-xl font-semibold transition-colors hover:text-indigo-500"
            href="/myPage"
          >
            My Page
          </Link>
          <button
            className="text-right text-xl font-semibold transition-colors hover:text-indigo-500"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      );
    } else {
      return (
        <button
          className="col-start-2 col-end-3 text-right text-xl font-semibold transition-colors hover:text-indigo-500"
          onClick={() => signIn("google")}
        >
          Sign in
        </button>
      );
    }
  };

  return (
    <header className="grid grid-cols-2 px-10 py-2">
      <Link
        className="col-start-1 col-end-2 text-left text-3xl font-semibold transition-colors hover:text-indigo-500"
        href="/"
      >
        Image Converter
      </Link>
      {isSignedIn()}
    </header>
  );
};

export default Header;
