import HomePageAnimationBG from "@/components/HomePageAnimationBG";
import { SiteHeader } from "@/components/SiteHeader";

import { Compass } from "lucide-react";
import LandingFeatureCards from "@/components/LandingFeatureCards";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return <main className="app-shell landing-shell">
    <SiteHeader landing />
    <section>
      <HomePageAnimationBG />
    </section>
    <LandingFeatureCards />

    <ContactSection />
    <section className="mini-guide" id="guide"><Compass size={19} /><span>Curated sample data today. Ready for an API, auth, and production data tomorrow.</span></section>
  </main>;
}
