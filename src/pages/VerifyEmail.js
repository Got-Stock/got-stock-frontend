import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { CheckCircle, XCircle, Mail } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid verification link");
      setVerifying(false);
      return;
    }
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setVerifying(true);
      const response = await axios.get(`${API}/auth/verify-email?token=${token}`);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/customer-login");
        }, 3000);
      } else {
        setError(response.data.message || "Verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify email");
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/GSwhiteonblack.png" alt="GOT-STOCK" className="h-16 mx-auto mb-4" onError={(e) => e.target.style.display = 'none'} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {success ? (
            <>
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You can now enjoy all features of GOT-STOCK!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to login...
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Link to="/customer-login">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Go to Login
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">
                  Need a new link? Contact us at{" "}
                  <a href="mailto:admin@got-stock.com" className="text-purple-600 hover:text-purple-700">
                    admin@got-stock.com
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
