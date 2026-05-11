import { motion } from "motion/react";
import { Bot, MessageSquare, Users, BarChart3, Zap, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI-Powered Automation",
      description: "Intelligent chatbots that understand context and deliver personalized responses at scale",
      size: "large"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart Messaging",
      description: "Send targeted messages based on customer behavior and engagement patterns",
      size: "medium"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Audience Segmentation",
      description: "Organize and target your audience with precision using advanced AI analytics",
      size: "medium"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-Time Analytics",
      description: "Track performance, engagement, and ROI with comprehensive dashboards",
      size: "medium"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Responses",
      description: "Never miss a conversation with 24/7 automated intelligent responses",
      size: "medium"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with global data protection standards",
      size: "large"
    }
  ];

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Smart WhatsApp Automation
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Made Simple with NxtReach
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Run broadcasts, trigger chatbots, capture leads with Click to WhatsApp, and manage conversations—all from one powerful, automation-ready platform.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
          {/* Row 1: Card 1 (2 cols) + Card 2 (1 col) */}
          <FeatureCard feature={features[0]} delay={0} className="md:col-span-2" />
          <FeatureCard feature={features[1]} delay={0.1} className="md:col-span-1" />

          {/* Row 2: Card 3 (1 col) + Card 4 (2 cols) */}
          <FeatureCard feature={features[2]} delay={0.2} className="md:col-span-1" />
          <FeatureCard feature={features[3]} delay={0.3} className="md:col-span-2" />

          {/* Row 3: Card 5 (2 cols) + Card 6 (1 col) */}
          <FeatureCard feature={features[4]} delay={0.4} className="md:col-span-2" />
          <FeatureCard feature={features[5]} delay={0.5} className="md:col-span-1" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, delay, className }: { feature: any, delay: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

      <div className="relative">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
            {feature.icon}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
        <p className="text-gray-400 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}
