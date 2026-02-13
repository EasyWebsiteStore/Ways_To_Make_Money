import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import OpportunityCard from "@/components/shared/OpportunityCard";

const categories = [
  { key: "all", label: "All Categories" },
  { key: "signups_rewards", label: "Signups & Rewards" },
  { key: "online_surveys", label: "Online Surveys" },
  { key: "learn_and_earn", label: "Learn & Earn" },
  { key: "crypto_nft_gaming", label: "Crypto & NFT Gaming" },
  { key: "cashback_coupons", label: "Cashback & Coupons" },
  { key: "referral_programs", label: "Referral Programs" },
  { key: "passive_income", label: "Passive Income" },
];

const recommendations = [
  { key: "all", label: "All Levels" },
  { key: "highly_recommended", label: "Top Picks" },
  { key: "recommended", label: "Recommended" },
  { key: "decent", label: "Decent" },
];

export default function Browse() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category") || "all";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [recommendation, setRecommendation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["all-opportunities"],
    queryFn: () => base44.entities.Opportunity.filter({ is_active: true }, "-created_date", 100),
    initialData: [],
  });

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchSearch = !search || opp.title?.toLowerCase().includes(search.toLowerCase()) || opp.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || opp.category === category;
      const matchRec = recommendation === "all" || opp.recommendation === recommendation;
      return matchSearch && matchCategory && matchRec;
    });
  }, [opportunities, search, category, recommendation]);

  const activeFilters = (category !== "all" ? 1 : 0) + (recommendation !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Browse Opportunities</h1>
          <p className="mt-2 text-gray-400 text-lg">Discover ways to earn money online</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search opportunities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 rounded-xl border-white/10 text-gray-300 hover:text-white hover:bg-white/10 ${showFilters ? "bg-white/10" : ""}`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFilters > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 p-5 bg-white/5 border border-white/10 rounded-xl">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={recommendation} onValueChange={setRecommendation}>
                <SelectTrigger className="w-44 bg-white/5 border-white/10 text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {recommendations.map((r) => (
                    <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeFilters > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => { setCategory("all"); setRecommendation("all"); }}
                  className="text-gray-400 hover:text-white"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"} found
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Skeleton className="h-40 w-full rounded-xl bg-white/10 mb-4" />
                <Skeleton className="h-5 w-3/4 bg-white/10 mb-2" />
                <Skeleton className="h-4 w-full bg-white/10 mb-1" />
                <Skeleton className="h-4 w-2/3 bg-white/10" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No opportunities found matching your criteria.</p>
            <Button
              variant="ghost"
              onClick={() => { setSearch(""); setCategory("all"); setRecommendation("all"); }}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}