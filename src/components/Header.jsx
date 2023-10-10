"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
  const { status } = useSession();

  // Check if a user signed in
  const isSignedIn = () => {
    if (status == "authenticated") {
      return (
        <button
          className="col-start-3 col-end-4 text-xl font-semibold"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      );
    } else {
      return (
        <button
          className="col-start-3 col-end-4 text-xl font-semibold"
          onClick={() => signIn("google")}
        >
          Sign in
        </button>
      );
    }
  };

  return (
    <header className="grid grid-cols-3 py-2">
      <h1 className="col-start-1 col-end-2 text-center text-3xl font-semibold">
        Image Converter
      </h1>
      {isSignedIn()}
    </header>
  );
};

export default Header;
