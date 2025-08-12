'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header({ user, setUser, setRoute }: any) {
  return (
    <header className="p-6 border-b border-gray-800 flex items-center">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold tracking-wide">
          <a href="#home" onClick={() => setRoute("#home")}>
            GERALD<span className="text-sm">.io</span>
          </a>
        </h1>
      </div>

      {/* Center: Nav */}
      <div className="flex-grow flex justify-center">
        <nav className="space-x-6 text-sm font-medium">
          <a href="#features" className="text-white transition-colors duration-200 hover:text-[#C0FF00]">Features</a>
          <a href="#how-it-works" className="text-white transition-colors duration-200 hover:text-[#C0FF00]">How It Works</a>
          <a href="#pricing" className="text-white transition-colors duration-200 hover:text-[#C0FF00]">Pricing</a>
          <a href="#contact" className="text-white transition-colors duration-200 hover:text-[#C0FF00]">Contact</a>
          <Link href="/chat" className="text-white transition-colors duration-200 hover:text-[#C0FF00]">Chat</Link>
          {!user && (
            <a href="#login" className="text-white transition-colors duration-200 hover:text-[#C0FF00]">Login</a>
          )}
          {user && (
            <a href="#account" className="text-white transition-colors duration-200 hover:text-[#C0FF00]">Account</a>
          )}
        </nav>
      </div>

      {/* Right: Auth/User actions */}
      <div className="flex-shrink-0">
        {user && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setUser(null);
              setRoute("#home");
            }}
            className="text-white transition-colors duration-200 hover:text-[#C0FF00]"
          >
            Sign out
          </a>
        )}
      </div>
    </header>
  );
}
