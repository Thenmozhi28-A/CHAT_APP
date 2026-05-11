import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-12 md:p-20 rounded-[40px] bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 backdrop-blur-xl text-center overflow-hidden group"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Ready to transform your business?</span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white">
              Start Your Growth{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Journey Today
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ businesses automating their WhatsApp engagement and scaling their success with nxtReach.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                type="button"
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-lg font-bold shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 hover:scale-105 text-white"
              >
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-lg font-bold hover:scale-105 text-white"
              >
                Schedule Demo
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
