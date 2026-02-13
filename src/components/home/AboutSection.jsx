import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Heart } from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Personally Tested", desc: "Every opportunity listed has been tried and verified by me before being shared." },
  { icon: Eye, title: "Full Transparency", desc: "Honest reviews with real earning proof — no exaggerations or empty promises." },
  { icon: Heart, title: "Community First", desc: "I share what works and what doesn't, so you don't waste your time." },
];

export default function AboutSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-10 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Trust This Site?</h2>
            <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
              I'm Ashley — I've spent countless hours researching and testing online earning opportunities 
              so you don't have to. Here's what I stand for:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">{v.title}</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}