import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Gift, ClipboardList, GraduationCap, Gamepad2, Receipt, Users, TrendingUp } from "lucide-react";

const categories = [
  { key: "signups_rewards", label: "Signups & Rewards", icon: Gift, color: "from-blue-500 to-blue-600", desc: "Welcome bonuses & incentives" },
  { key: "online_surveys", label: "Online Surveys", icon: ClipboardList, color: "from-emerald-500 to-emerald-600", desc: "Paid surveys & market research" },
  { key: "learn_and_earn", label: "Learn & Earn", icon: GraduationCap, color: "from-amber-500 to-amber-600", desc: "Get paid to learn new skills" },
  { key: "crypto_nft_gaming", label: "Crypto & NFT Gaming", icon: Gamepad2, color: "from-purple-500 to-purple-600", desc: "Play-to-earn & blockchain rewards" },
  { key: "cashback_coupons", label: "Cashback & Coupons", icon: Receipt, color: "from-pink-500 to-pink-600", desc: "Save money while spending" },
  { key: "referral_programs", label: "Referral Programs", icon: Users, color: "from-cyan-500 to-cyan-600", desc: "Earn by sharing with friends" },
  { key: "passive_income", label: "Passive Income", icon: TrendingUp, color: "from-orange-500 to-orange-600", desc: "Set it and forget it streams" },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Browse by Category
          </h2>
          <p className="mt-3 text-gray-400 text-lg">Find opportunities that match your interests</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <Link to={createPageUrl("Browse") + `?category=${cat.key}`}>
                <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">{cat.label}</h3>
                  <p className="text-gray-400 text-sm mt-1">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}