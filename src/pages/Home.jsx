import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedOpportunities from "@/components/home/FeaturedOpportunities";
import AboutSection from "@/components/home/AboutSection";

export default function Home() {
  const { data: opportunities } = useQuery({
    queryKey: ["featured-opportunities"],
    queryFn: () => base44.entities.Opportunity.filter({ is_featured: true, is_active: true }, "-created_date", 6),
    initialData: [],
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedOpportunities opportunities={opportunities} />
      <CategoryGrid />
      <AboutSection />
    </div>
  );
}