import { motion } from "motion/react";
import { Link } from "react-router";
import logo from "../../assets/LOGO.png";

interface HeaderProps {
  activePage?: "home" | "pricing" | "features" | "integrations" | "testimonials";
}

export default function Header({ activePage }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-50 w-full pt-[52px]"
    >
      <div className="w-full px-[62px] flex items-center justify-between">
        {/* <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">nxtReach</span>
        </Link> */}

        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="nxtReach Logo" className="w-15 h-15 object-contain" />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            nxtReach
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/#features"
            className={`text-sm transition-colors ${activePage === "features" ? "text-white" : "text-gray-300 hover:text-white"}`}
          >
            Features
          </Link>
          <Link
            to="/#integrations"
            className={`text-sm transition-colors ${activePage === "integrations" ? "text-white" : "text-gray-300 hover:text-white"}`}
          >
            Integrations
          </Link>
          <Link
            to="/#testimonials"
            className={`text-sm transition-colors ${activePage === "testimonials" ? "text-white" : "text-gray-300 hover:text-white"}`}
          >
            Testimonials
          </Link>
          <Link
            to="/pricing"
            className={`text-sm transition-colors ${activePage === "pricing" ? "text-white" : "text-gray-300 hover:text-white"}`}
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">Login</Link>
          <button
            type="button"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium shadow-lg shadow-purple-500/30 text-white"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </motion.header>
  );
}
