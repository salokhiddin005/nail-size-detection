// import Hero from "@/components/Hero";
// import FeatureGrid from "@/components/FeatureGrid";
// import HowItWorks from "@/components/HowItWorks";
// import CTASection from "@/components/CTASection";

// export default function Home() {
//   return (
//     <>
//       <Hero />
//       <FeatureGrid />
//       <HowItWorks />
//       <CTASection />
//     </>
//   );
// }


import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <main
      className="min-h-screen text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="min-h-screen bg-black/60">
        <Hero />
        <FeatureGrid />
        <HowItWorks />
        <CTASection />
      </div>
    </main>
  );
}