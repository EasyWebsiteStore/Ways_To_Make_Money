import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Star, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const recommendationLabel = {
  highly_recommended: { label: "Top Pick", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  recommended: { label: "Recommended", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  decent: { label: "Decent", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  not_recommended: { label: "Skip", color: "bg-red-500/20 text-red-400 border-red-500/30" },
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
  easy: { label: "Easy", color: "text-green-400" },
  medium: { label: "Medium", color: "text-yellow-400" },
  hard: { label: "Hard", color: "text-red-400" },
};

export default function OpportunityCard({ opportunity }) {
  const opp = opportunity;

  return (
    <Link to={createPageUrl("OpportunityDetail") + `?id=${opp.id}`}>
      <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:bg-white/[0.08] transition-all duration-300 h-full flex flex-col">
        {opp.image_url && (
          <div className="h-40 overflow-hidden">
            <img
              src={opp.image_url}
              alt={opp.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className="text-xs text-gray-400 border-white/10">
              {categoryLabel[opp.category] || opp.category}
            </Badge>
            {opp.recommendation && recommendationLabel[opp.recommendation] && (
              <Badge className={`text-xs border ${recommendationLabel[opp.recommendation].color}`}>
                {recommendationLabel[opp.recommendation].label}
              </Badge>
            )}
          </div>

          <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
            {opp.title}
            <ArrowUpRight className="w-4 h-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>

          <p className="text-gray-400 text-sm mt-2 line-clamp-2 flex-1">{opp.description}</p>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 flex-wrap">
            {opp.earning_potential && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {opp.earning_potential}
              </span>
            )}
            {opp.time_investment && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {opp.time_investment}
              </span>
            )}
            {opp.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                {opp.rating}/5
              </span>
            )}
            {opp.difficulty && difficultyLabel[opp.difficulty] && (
              <span className={`${difficultyLabel[opp.difficulty].color}`}>
                {difficultyLabel[opp.difficulty].label}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}