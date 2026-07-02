import React from "react";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="gs-fade-up mx-auto max-w-md text-center">
        <p className="text-7xl font-extrabold tracking-tight text-[#FF3CFE]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/">
            <Button className="gs-glow-btn w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Browse the shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
