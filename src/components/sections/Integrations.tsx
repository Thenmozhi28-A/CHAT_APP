import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function Integrations() {
  const integrations = [
    {
      name: "Shopify",
      logo: "https://cdn.worldvectorlogo.com/logos/shopify.svg"
    },
    {
      name: "Zapier",
      logo: "https://cdn.worldvectorlogo.com/logos/zapier.svg"
    },
    {
      name: "HubSpot",
      logo: "https://cdn.worldvectorlogo.com/logos/hubspot.svg"
    },
    {
      name: "Salesforce",
      logo: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg"
    },
    {
      name: "Stripe",
      logo: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
    },
    {
      name: "WooCommerce",
      logo: "https://cdn.worldvectorlogo.com/logos/woocommerce.svg"
    },
    {
      name: "Twilio",
      logo: "https://cdn.worldvectorlogo.com/logos/twilio.svg"
    },
    {
      name: "WordPress",
      logo: "https://cdn.worldvectorlogo.com/logos/wordpress-icon-1.svg"
    },
  ];

  return (
    <section id="integrations" className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Connect With Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Favorite Tools
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Seamlessly integrate with the tools you already use
          </p>
        </motion.div>

        {/* Floating Logo Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 items-center justify-items-center relative z-10">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 blur-2xl transition-all duration-500 rounded-full scale-150" />

                {/* Logo Container */}
                <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className="w-full h-full object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 whitespace-nowrap">
                    <span className="text-xs font-medium text-white">{integration.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">+ 50 more integrations available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
