import { Footer } from "@/components/marketing/footer";
import { Nav } from "@/components/marketing/nav";
import { QuoteForm } from "@/components/marketing/quote-form";
import { ServiceCards } from "@/components/marketing/service-cards";
import { SolutionsHero } from "@/components/marketing/solutions-hero";

export const metadata = {
  title: "Services — Solmy by AISS AI Software Solutions",
  description:
    "Custom AI automation agents, custom software solutions, and the Solmy AI receptionist for Malaysian businesses. Request a quote.",
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <SolutionsHero />
      <ServiceCards />
      <QuoteForm />
      <Footer />
    </div>
  );
}
