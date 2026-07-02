import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package, Users, ShoppingCart, DollarSign, Search, TrendingUp,
  CheckCircle, XCircle, Clock, ArrowRight, Building2, Mail, FileCheck, Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import AdminLayout from "../components/AdminLayout";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const SELLER_STATUS = {
  onboarding:     { label: "Onboarding",     cls: "bg-sky-100 text-sky-700" },
  pending_review: { label: "Pending review", cls: "bg-amber-100 text-amber-700" },
  pending:        { label: "Pending",        cls: "bg-amber-100 text-amber-700" },
};

const KpiCard = ({ label, value, icon: Icon, tone = "text-[#FF3CFE]", onClick, badge }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`gs-lift rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm ${onClick ? "cursor-pointer hover:border-[#FF3CFE]/40" : "cursor-default"}`}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <Icon className={`h-4 w-4 ${tone}`} />
    </div>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    {badge}
  </button>
);

export default function AdminHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [sellers, setSellers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState({ topSearches: [], trendingProducts: [] });
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [st, sel, sub, an] = await Promise.allSettled([
        axios.get(`${API}/stats`, { withCredentials: true }),
        axios.get(`${API}/admin/sellers`, { withCredentials: true }),
        axios.get(`${API}/admin/products/pending`, { withCredentials: true }),
        axios.get(`${API}/admin/analytics`, { withCredentials: true }),
      ]);
      if (st.status === "fulfilled") setStats(st.value.data || {});
      if (sel.status === "fulfilled") setSellers(sel.value.data || []);
      if (sub.status === "fulfilled") setSubmissions((sub.value.data || []).slice(0, 6));
      if (an.status === "fulfilled") setAnalytics(an.value.data || { topSearches: [], trendingProducts: [] });
      if (st.status === "rejected" && (st.reason?.response?.status === 401 || st.reason?.response?.status === 403)) {
        toast.error("Admin access required");
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const pendingSellers = sellers.filter(
    (s) => !["approved", "rejected", "suspended"].includes(s.status || "onboarding")
  );

  const handleSellerAction = async (sellerId, status) => {
    setActioningId(sellerId + status);
    try {
      await axios.put(`${API}/admin/sellers/${sellerId}/status`, { status }, { withCredentials: true });
      toast.success(`Seller ${status === "approved" ? "approved" : "rejected"}`);
      setSellers((prev) => prev.map((s) => (s.seller_id === sellerId ? { ...s, status } : s)));
      axios.get(`${API}/stats`, { withCredentials: true }).then((r) => setStats(r.data || {})).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update seller");
    } finally {
      setActioningId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Overview">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Overview">
      <div className="space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{greeting()}, Admin</h2>
          <p className="mt-1 text-gray-500">Your marketplace at a glance — clear the queues below.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Products" value={stats.total_products ?? 0} icon={Package} onClick={() => navigate("/admin/products")} />
          <KpiCard
            label="Pending Submissions" value={stats.pending_approval ?? 0} icon={FileCheck} tone="text-amber-500"
            onClick={() => navigate("/admin/submissions")}
            badge={stats.pending_approval > 0 ? <Badge className="mt-2 bg-amber-100 text-amber-700">Needs review</Badge> : null}
          />
          <KpiCard
            label="Pending Sellers" value={stats.pending_sellers ?? 0} icon={Users} tone="text-orange-500"
            onClick={() => navigate("/admin/sellers")}
            badge={stats.pending_sellers > 0 ? <Badge className="mt-2 bg-orange-100 text-orange-700">Awaiting approval</Badge> : null}
          />
          <KpiCard label="Active Sellers" value={stats.active_sellers ?? 0} icon={CheckCircle} tone="text-emerald-500"
            onClick={() => navigate("/admin/sellers")}
            badge={<p className="mt-1 text-xs text-gray-400">of {stats.total_sellers ?? 0} total</p>} />
        </div>

        {/* Seller approvals — inline actions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#FF3CFE]" />
              <h3 className="font-bold text-gray-900">Seller approvals</h3>
              {pendingSellers.length > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF3CFE] px-1.5 text-[11px] font-bold text-white">
                  {pendingSellers.length}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/sellers")} className="text-[#FF3CFE] hover:bg-[#FF3CFE]/10">
              Manage all<ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {pendingSellers.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-800">No sellers awaiting approval — you're all caught up.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSellers.slice(0, 5).map((s) => {
                const sm = SELLER_STATUS[s.status] || { label: s.status || "Onboarding", cls: "bg-gray-100 text-gray-600" };
                const approving = actioningId === s.seller_id + "approved";
                const rejecting = actioningId === s.seller_id + "rejected";
                return (
                  <div key={s.seller_id} className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FF3CFE]/10 text-[#FF3CFE]">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-gray-900">{s.business_name || "Unnamed business"}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${sm.cls}`}>{sm.label}</span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-gray-500">
                          <Mail className="h-3.5 w-3.5" /> {s.business_email || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSellerAction(s.seller_id, "approved")}
                        disabled={!!actioningId}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        {approving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-1 h-4 w-4" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSellerAction(s.seller_id, "rejected")}
                        disabled={!!actioningId}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        {rejecting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <XCircle className="mr-1 h-4 w-4" />}
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submissions review queue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#FF3CFE]" />
              <h3 className="font-bold text-gray-900">Product submissions</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/submissions")} className="text-[#FF3CFE] hover:bg-[#FF3CFE]/10">
              Review all<ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          {submissions.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-800">No submissions waiting — the queue is clear.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {submissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => navigate("/admin/submissions")}
                  className="group gs-lift flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-left hover:border-[#FF3CFE]/40"
                >
                  <img
                    src={sub.media?.images?.[0] || "https://via.placeholder.com/64"}
                    alt={sub.name}
                    className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{sub.name}</p>
                    <p className="truncate text-xs text-gray-500">{sub.brand}</p>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-600">Pending</Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Top searches</h3>
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            {analytics.topSearches?.length > 0 ? (
              <div className="space-y-2">
                {analytics.topSearches.slice(0, 6).map((sq, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="truncate text-sm text-gray-700">{sq.query}</span>
                    <Badge variant="secondary">{sq.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">No search data yet.</p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Trending products</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            {analytics.trendingProducts?.length > 0 ? (
              <div className="space-y-2">
                {analytics.trendingProducts.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="truncate text-sm text-gray-700">{p.name}</span>
                    <Badge variant="secondary">{p.views} views</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">No trending data yet.</p>
            )}
          </div>
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Orders" value={stats.total_orders ?? 0} icon={ShoppingCart} tone="text-indigo-500" onClick={() => navigate("/admin/orders")} />
          <KpiCard label="Revenue" value={`$${Number(stats.total_revenue || 0).toLocaleString()}`} icon={DollarSign} tone="text-green-500" />
          <KpiCard label="Onboarding Sellers" value={stats.onboarding_sellers ?? 0} icon={Clock} tone="text-sky-500" onClick={() => navigate("/admin/sellers")} />
          <KpiCard label="Total Sellers" value={stats.total_sellers ?? 0} icon={Users} onClick={() => navigate("/admin/sellers")} />
        </div>
      </div>
    </AdminLayout>
  );
}
