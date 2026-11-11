import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import EngineeringSection from "@/components/sections/EngineeringSection";
import CraftsmanshipSection from "@/components/sections/CraftsmanshipSection";
import SpecificationsSection from "@/components/sections/SpecificationsSection";
import FinalRevealSection from "@/components/sections/FinalRevealSection";
import Footer from "@/components/layout/Footer";

// Interactive explorer (framer-motion + hotspots) is split into its own chunk.
const DetailsSection = dynamic(() => import("@/components/sections/DetailsSection"));

export default function Home() {
  return (
    <>
      <main className="overflow-x-clip">
        <HeroSection />
        <PhilosophySection />
        <DetailsSection />
        <EngineeringSection />
        <CraftsmanshipSection />
        <SpecificationsSection />
        <FinalRevealSection />
      </main>
      <Footer />
    </>
  );
}
