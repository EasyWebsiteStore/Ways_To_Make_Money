import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Star, Clock, DollarSign, ExternalLink, Copy, Check, Lightbulb, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const recommendationLabel = {
  highly_recommended: { label: "Top Pick", color: "bg-green-500/20 text-green-400 border-green-500/30", desc: "Highly recommended — one of the best!" },
  recommended: { label: "Recommended", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", desc: "A solid opportunity worth trying." },
  decent: { label: "Decent", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", desc: "Okay option, but don't expect too much." },
  not_recommended: { label: "Not Recommended", color: "bg-red-500/20 text-red-400 border-red-500/30", desc: "I'd skip this one — not worth the time." },
};

const categoryLabel = {
  signups_rewards: "Signups & Rewards",
  online_surveys: "Online Surveys",
  learn_and_earn: "Learn & Earn",
  crypto_nft_gaming: "Crypto & NFT Gaming",
  cashback_coupons: "Cashback & Coupons",
  referral_programs: "Referral Programs",
  passive_income: "Passive Income",
};

const difficultyLabel = {
  easy: { label: "Easy", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  medium: { label: "Medium", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  hard: { label: "Hard", color: "text-red-400 bg-red-500/10 border-red-500/20" },
};

export default function OpportunityDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const [copied, setCopied] = React.useState(false);

  const { data: opp, isLoading } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: async () => {
      const list = await base44.entities.Opportunity.filter({ id }, "-created_date", 1);
      return list[0] || null;
    },
    enabled: !!id,
  });

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(opp.coupon_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32 bg-white/10 mb-8" />
        <Skeleton className="h-64 w-full bg-white/10 rounded-2xl mb-6" />
        <Skeleton className="h-10 w-2/3 bg-white/10 mb-4" />
        <Skeleton className="h-6 w-full bg-white/10 mb-2" />
        <Skeleton className="h-6 w-3/4 bg-white/10" />
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Opportunity not found.</p>
          <Link to={createPageUrl("Browse")}>
            <Button variant="ghost" className="mt-4 text-blue-400">Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  const rec = recommendationLabel[opp.recommendation];
  const diff = difficultyLabel[opp.difficulty];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link to={createPageUrl("Browse")}>
          <Button variant="ghost" className="text-gray-400 hover:text-white mb-6 -ml-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Browse
          </Button>
        </Link>

        {/* Hero image */}
        {opp.image_url && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-white/10">
            <img src={opp.image_url} alt={opp.title} className="w-full h-64 md:h-80 object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-gray-400 border-white/10">
              {categoryLabel[opp.category] || opp.category}
            </Badge>
            {rec && (
              <Badge className={`border ${rec.color}`}>{rec.label}</Badge>
            )}
            {diff && (
              <Badge className={`border ${diff.color}`}>{diff.label}</Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white">{opp.title}</h1>

          {rec && (
            <p className="mt-3 text-gray-400 italic">{rec.desc}</p>
          )}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {opp.rating && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                <Star className="w-5 h-5 fill-yellow-400" />
                <span className="text-2xl font-bold">{opp.rating}</span>
                <span className="text-gray-500 text-sm">/5</span>
              </div>
              <p className="text-gray-500 text-xs">Rating</p>
            </div>
          )}
          {opp.earning_potential && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                <DollarSign className="w-5 h-5" />
                <span className="text-lg font-bold">{opp.earning_potential}</span>
              </div>
              <p className="text-gray-500 text-xs">Earning Potential</p>
            </div>
          )}
          {opp.time_investment && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-bold">{opp.time_investment}</span>
              </div>
              <p className="text-gray-500 text-xs">Time Required</p>
            </div>
          )}
          {opp.difficulty && diff && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-lg font-bold ${diff.color.split(" ")[0]} mb-1`}>
                {diff.label}
              </div>
              <p className="text-gray-500 text-xs">Difficulty</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">About This Opportunity</h2>
          <div className="text-gray-300 leading-relaxed whitespace-pre-line">{opp.description}</div>
        </div>

        {/* Tips */}
        {opp.tips && (
          <div className="mb-10 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Tips & Tricks</h2>
            </div>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">{opp.tips}</div>
          </div>
        )}

        {/* Coupon code */}
        {opp.coupon_code && (
          <div className="mb-10 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Coupon / Discount Code</h2>
            <div className="flex items-center gap-3">
              <code className="bg-white/10 px-4 py-2 rounded-lg text-purple-300 font-mono text-lg tracking-wider">
                {opp.coupon_code}
              </code>
              <Button variant="ghost" size="sm" onClick={handleCopyCoupon} className="text-purple-400 hover:text-purple-300">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        {/* Evidence images */}
        {opp.evidence_images && opp.evidence_images.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-white">Earning Proof</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opp.evidence_images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10">
                  <img src={img} alt={`Evidence ${i + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          {opp.referral_link && (
            <a href={opp.referral_link} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-6 text-lg shadow-lg shadow-blue-500/25">
                Get Started
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
          )}
          {opp.platform_url && !opp.referral_link && (
            <a href={opp.platform_url} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-6 text-lg shadow-lg shadow-blue-500/25">
                Visit Platform
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
          )}
          {opp.platform_url && opp.referral_link && (
            <a href={opp.platform_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl py-6 text-lg">
                Visit Platform Directly
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}