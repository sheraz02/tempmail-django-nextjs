"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Shuffle, Trash2 } from "lucide-react";



const Header = ({ onEmailChange, onRefresh }) => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // API call to Django backend
  const generateNewEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/generate-email");
      if (!response.ok) throw new Error("Failed to fetch email");
      const data = await response.json();
      setEmail(data.email);
      onEmailChange(data.email); // notify Mailbox
    } catch (error) {
      console.error(error);
      setEmail("Error generating email");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  // Copy functionality
  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <div className="min-h-[300px] w-full relative bg-black flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-12">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-cyan-300 drop-shadow-lg">
            Get Your Temporary Email Address
          </h1>

          {/* Email Display */}
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Click 'Change Button' to get a temp email"
              value={email}
              readOnly
              className="w-full rounded-xl border border-cyan-500/40 bg-black/40 
               text-white placeholder:text-gray-400 px-5 py-3 sm:py-4 text-base sm:text-lg 
               shadow-lg focus:outline-none focus:ring-2 
               focus:ring-cyan-400 focus:border-cyan-400 transition-all pr-28"
            />

            {/* Copy Button */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {copied && (
                <span className="text-xs sm:text-sm text-cyan-400 animate-pulse">
                  Copied!
                </span>
              )}
              <Button
                onClick={handleCopy}
                size="icon"
                variant="ghost"
                className="text-cyan-300 hover:cursor-pointer hover:text-white hover:bg-cyan-500/20 rounded-lg transition-colors"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-wrap w-full max-w-2xl">
          <Button onClick={handleCopy} className="btn-style hover:cursor-pointer">
            <Copy className="h-4 w-4" /> Copy
          </Button>

          {/* Refresh Button */}
          <Button onClick={onRefresh} className="btn-style hover:cursor-pointer">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>

          {/* Change Button (with Confirm Popup) */}
          <Button
            disabled={loading}
            onClick={() => setShowConfirm(true)}
            className="btn-style hover:cursor-pointer"
          >
            <Shuffle className="h-4 w-4" />
            {loading ? "Loading..." : "Change"}
          </Button>
        </div>

        {/* Confirmation Popup */}
        {showConfirm && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="bg-black text-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
              <h2 className="text-lg font-semibold mb-4 text-cyan-300">
                Are you sure?
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Changing email will reset your mailbox.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={generateNewEmail}
                  className="btn-style hover:cursor-pointer"
                >
                  Yes, Change
                </Button>
                <Button
                  onClick={() => setShowConfirm(false)}
                  variant="outline"
                  className="btn-style bg-black/50 hover:cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Reusable Button Style
const btnStyle =
  "w-full sm:w-auto px-4 py-2 rounded-xl bg-black border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-all shadow-md flex items-center justify-center gap-2";
export default Header;
