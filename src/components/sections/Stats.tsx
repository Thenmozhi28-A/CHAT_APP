import { motion } from "motion/react";

export default function Stats() {
  const stats = [
    {
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="20" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M8 28h48M20 12l8 8M44 12l-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M24 36h16M24 42h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      value: "98%",
      label: "Open Rate",
      description: "Ensure your messages get seen."
    },
    {
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
          <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M42 42l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M28 20v8m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      value: "45%",
      label: "Click-Through Rate",
      description: "Higher than email & SMS marketing."
    },
    {
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M22 32c0-2 2-4 5-4s5 2 5 4m10 0c0-2 2-4 5-4s5 2 5 4M24 38c0 4 3.5 7 8 7s8-3 8-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      value: "80%+",
      label: "Engagement Rate",
      description: "Instant interaction with customers."
    },
    {
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
          <path d="M12 52V32l10-8 10 6 10-10 10 8v24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M48 20l6-6m0 0h-6m6 0v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: "5x",
      label: "Higher Conversions",
      description: "More sales & leads compared to traditional channels."
    }
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Why Businesses Choose
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              nxtReach
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative text-center group"
            >
              {/* Floating Icon */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-10, 0, -10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl rounded-full scale-150" />

                  {/* Icon Container */}
                  <div className="relative text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>
              </motion.div>

              {/* Large Number */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-br from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <h3 className="text-xl font-semibold mb-3 text-white">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
