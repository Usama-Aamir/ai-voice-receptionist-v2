import { Footer } from "@/components/marketing/footer";
import { Nav } from "@/components/marketing/nav";

const faqs = [
  {
    question: "What is Solmy?",
    answer:
      "Solmy is an AI receptionist built for Malaysian small and medium businesses. It answers customer messages in multiple languages, responds from your real business knowledge, checks live availability, and books appointments automatically.",
  },
  {
    question: "Which languages does Solmy support?",
    answer:
      "Solmy supports English, Bahasa Malaysia, Tamil, and Chinese. It also understands romanized input such as Pinyin for Chinese and Tanglish (romanized Tamil) in Latin letters, and replies in the same style your customer used.",
  },
  {
    question: "How does the appointment booking work?",
    answer:
      "When a customer asks for an available slot, Solmy calls the availability tool against your configured business hours and services. It suggests open slots, and once the customer confirms a time, it books the appointment directly into your dashboard.",
  },
  {
    question: "Can Solmy answer questions about my services, prices, and hours?",
    answer:
      "Yes. Solmy answers only from the knowledge base, services list, and business hours you provide in the dashboard. It will not invent pricing, availability, or policies.",
  },
  {
    question: "What happens if Solmy does not know the answer?",
    answer:
      "It politely says so and, when appropriate, offers your business phone number or email so the customer can reach a human. You can also set fallback contact details in your business profile.",
  },
  {
    question: "Is Solmy suitable for my industry?",
    answer:
      "Solmy is designed for appointment-based service businesses such as dental and medical clinics, car workshops, salons, restaurants, law firms, and recruitment agencies. If your business takes bookings, it likely fits.",
  },
  {
    question: "Can customers contact me through WhatsApp or phone calls?",
    answer:
      "Today, Solmy works through the public chat widget on your website. WhatsApp and phone call integration are on the roadmap and will be added as they become available.",
  },
  {
    question: "Where do I see customer conversations and bookings?",
    answer:
      "Everything appears in your Solmy dashboard: conversations, appointments, customers, services, knowledge base, business hours, and team settings.",
  },
  {
    question: "What do I need to set up Solmy?",
    answer:
      "You need to add your business profile, operating hours, services, and any common questions or knowledge base articles. The setup is designed to take minutes, not days.",
  },
  {
    question: "Can I customize the way Solmy speaks?",
    answer:
      "Solmy's tone is professional and direct. You control what it knows through your knowledge base and services, which shapes the content of every response.",
  },
  {
    question: "How much does Solmy cost?",
    answer:
      "Pricing is based on message volume and the features you need. Contact us at info@aiss.my or use the quote form for a custom proposal.",
  },
  {
    question: "Is there a free trial or pilot?",
    answer:
      "We offer pilot arrangements for qualifying businesses. Reach out to discuss your volume and requirements and we will propose a suitable plan.",
  },
  {
    question: "Is my customer data secure?",
    answer:
      "Data is stored in Supabase with Row Level Security scoped to your business. We do not share your customers' data with other businesses or use it to train general models.",
  },
  {
    question: "Does Solmy integrate with my existing calendar?",
    answer:
      "Solmy has a built-in availability and booking system. Calendar integrations with external providers are on the roadmap; let us know which platform you use.",
  },
  {
    question: "Can Solmy handle multiple branches or locations?",
    answer:
      "Each Solmy business account is scoped to one business. Multi-location support is planned; contact us if you need this now and we can discuss options.",
  },
  {
    question: "What devices and browsers does Solmy support?",
    answer:
      "The dashboard and public chat widget work on modern desktop and mobile browsers. No app installation is required for your customers.",
  },
  {
    question: "How do I get support?",
    answer:
      "Email us at info@aiss.my or call +60162104126. For existing customers, support details are available in the dashboard.",
  },
  {
    question: "How do I cancel or delete my account?",
    answer:
      "Contact us at info@aiss.my and we will close your account and help you export any data you need.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. You can export your customer, appointment, and conversation data from the dashboard. Contact support if you need a bulk export.",
  },
  {
    question: "Who built Solmy?",
    answer:
      "Solmy is built by AISS AI Software Solutions Sdn. Bhd., a registered Malaysian software company (Registration No: 972797-X) focused on practical AI tools for local SMEs.",
  },
];

export const metadata = {
  title: "FAQs — Solmy by AISS AI Software Solutions",
  description:
    "Frequently asked questions about Solmy: languages, booking, setup, pricing, security, and support.",
};

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <main className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
            FAQs
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-text-secondary">
            Everything you need to know about Solmy, how it works, and how to
            get started.
          </p>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-lg border border-border bg-surface"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-base font-medium text-text-primary transition-colors hover:text-accent focus:outline-none">
                  {faq.question}
                  <span className="ml-4 text-text-secondary transition-transform group-open:rotate-180">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-border px-5 pb-5 pt-4 text-sm leading-7 text-text-secondary">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
