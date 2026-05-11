import { motion } from "motion/react";
import { Check, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "FREE",
      yearlyPrice: "FREE",
      description: "Perfect for small businesses just getting started",
      badge: null,
      features: [
        "Unlimited Free Service Messages",
        "Contact Up to 20-25",
        "Manage Up to 1,000 Contacts",
        "Connect Two CRMs & 15",
        "Custom Attribute (Up to 5)",
        "Broadcast Reports"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Growth",
      price: "999",
      yearlyPrice: "779",
      description: "For rapidly-scaling startups",
      subdescription: "Advanced automation to fuel growth",
      badge: "Most Popular",
      features: [
        "WhatsApp Sales CRM",
        "Marketing Campaigns",
        "Manage Up to 5,000 Contacts",
        "Connect Five CRMs",
        "Custom Attributes (Up to 50)"
      ],
      cta: "Get Started",
      highlighted: true
    },
    {
      name: "Pro",
      price: "1,750",
      yearlyPrice: "1,530",
      description: "Premium, limited yearly",
      subdescription: "Advanced automation to fuel integrations at scale. Everything in Growth Plus",
      badge: null,
      features: [
        "WhatsApp Sales CRM",
        "Marketing Campaigns",
        "Unlimited Free Service Messages",
        "Manage Unlimited Contacts",
        "Connect Unlimited CRMs"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Enterprise",
      price: "Customized",
      yearlyPrice: "Customized",
      description: "For brands with high volume & custom needs",
      badge: null,
      features: [
        "WhatsApp Sales CRM",
        "Dedicated Support & Onboarding Conversations",
        "Marketing Campaigns",
        "Connect Unlimited Contacts",
        "Shared Unlimited Tags"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div 
          aria-hidden="true"
          className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)",
          backgroundSize: "48px 48px"
        }} />
      </div>

      <Header activePage="pricing" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Scale Your WhatsApp
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Marketing & Sales
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-4 max-w-3xl mx-auto leading-relaxed">
            Automate lead capture, follow-ups, and conversions on WhatsApp with one powerful platform.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-12">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Generated 90,000+ Chats for MSME by Automating</span>
          </div>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm transition-colors ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              type="button"
              aria-label="Toggle annual pricing"
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20 transition-colors"
            >
              <motion.div
                animate={{ x: isYearly ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm transition-colors ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                Yearly
              </span>
              <span className="px-2 py-1 rounded-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-xs text-purple-300">
                Save ₹220
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className={`group relative rounded-3xl p-8 transition-all duration-300 h-full ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-white/10 to-white/[0.05] border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20 scale-105 hover:shadow-purple-500/40'
                    : 'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20'
                }`}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none" />
                
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-semibold shadow-lg text-white">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Plan Name */}
                <div className="mb-6 relative z-10">
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400 min-h-[40px] leading-relaxed">{plan.description}</p>
                  {plan.subdescription && (
                    <p className="text-xs text-gray-500 mt-2 italic">{plan.subdescription}</p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-8 relative z-10">
                  {plan.price === "FREE" || plan.price === "Customized" ? (
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                      {plan.price}
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        ₹{isYearly ? plan.yearlyPrice : plan.price}
                      </span>
                      <span className="text-gray-400 text-sm">/month</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  className={`relative z-10 w-full py-3 rounded-full font-medium mb-8 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 text-white ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                      : plan.cta === "Contact Sales"
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                      : 'bg-white/10 border border-white/20 hover:bg-white/15'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Features */}
                <div className="space-y-4 relative z-10">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3 group/feature">
                      <div className="mt-0.5 transition-transform duration-300 group-hover/feature:scale-125">
                        <Check className="w-5 h-5 text-purple-400 group-hover/feature:text-purple-300" />
                      </div>
                      <span className="text-sm text-gray-300 group-hover/feature:text-white transition-colors duration-300 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ or Additional Info Section */}
      <section className="relative pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm"
          >
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Need a custom plan?
              </span>
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              We offer tailored solutions for enterprises with specific requirements. Let's discuss your needs.
            </p>
            <button 
              type="button"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-2xl shadow-purple-500/50 inline-flex items-center gap-2 text-white"
            >
              Talk to Sales
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
