import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Star, ArrowUpRight, Clock, DollarSign } from "lucide-react";
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

export default function FeaturedOpportunities({ opportunities }) {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Featured Picks
          </h2>
          <p className="mt-3 text-gray-400 text-lg">Hand-picked opportunities I personally recommend</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link to={createPageUrl("OpportunityDetail") + `?id=${opp.id}`}>
                <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:bg-white/[0.08] transition-all duration-300">
                  {opp.image_url && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={opp.image_url}
                        alt={opp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
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

                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{opp.description}</p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
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
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}