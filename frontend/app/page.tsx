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


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/dashboard");
      } else {
        router.replace("/signup");
      }
    };

    run();
  }, [router]);

  return null;
}