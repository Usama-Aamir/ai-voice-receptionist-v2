import { About } from "@/components/marketing/about";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Industries } from "@/components/marketing/industries";
import { Nav } from "@/components/marketing/nav";
import { Problem } from "@/components/marketing/problem";
import { WhySolmy } from "@/components/marketing/why-solmy";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <WhySolmy />
      <Industries />
      <FinalCta />
      <About />
      <Footer />
    </div>
  );
}
