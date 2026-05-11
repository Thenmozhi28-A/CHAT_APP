import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/validations/loginSchema";
import logo from "@/assets/LOGO.png";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useLoginMutation } from "@/store/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap();
      console.log("Login success:", response);
      if (response.data) {
        const userData = {
          userId: response.data.userId,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
        };
        dispatch(setCredentials({ 
          user: userData, 
          token: response.data.accessToken 
        }));
      }
      toast.success("Login successful!");
      navigate("/main");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.data?.message || error.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white relative flex items-center justify-center p-6 overflow-hidden">
      {/* Animated Background Consistency */}
      <div className="fixed inset-0 pointer-events-none">
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div
          aria-hidden="true"
          className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)",
            backgroundSize: "48px 48px"
          }} />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Back Link */}
        <div className="flex flex-col items-center mb-8">

          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="nxtReach Logo" className="w-15 h-15 object-contain" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              nxtReach
            </h1>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all group mb-8">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-gray-400 mb-8 text-sm">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                {...register("email")}
                label="Email Address"
                placeholder="name@company.com"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
              />

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                  <button type="button" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</button>
                </div>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  showPasswordToggle
                  error={errors.password?.message}
                />
              </div>

              <Button
                isLoading={isLoading}
                type="submit"
              >
                Sign In
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <button type="button" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">Get started free</button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      <WhatsAppButton />
    </div>
  );
}
