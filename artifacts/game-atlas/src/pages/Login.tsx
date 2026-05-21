import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const user = await auth.loginWithApi(values.email, values.password);
      setUser(user);
      toast({ title: "Welcome back!", description: `Logged in as ${user.displayName ?? user.username}` });
      setLocation("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast({ title: "Login Failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex bg-[#050505] text-white overflow-hidden">
      {/* Left side visual */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center border-r border-red-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.15)_0%,rgba(5,5,5,1)_70%)] z-0"></div>
        <div className="absolute inset-0 z-0 opacity-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth / 2,
                y: Math.random() * window.innerHeight,
                opacity: Math.random()
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [null, Math.random(), 0]
              }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <h1 className="font-orbitron text-7xl font-black tracking-widest mb-4 drop-shadow-[0_0_30px_rgba(139,0,0,0.8)]">
            GAME<span className="text-red-600">ATLAS</span>
          </h1>
          <p className="font-rajdhani text-2xl text-gray-400 tracking-[0.3em] uppercase">The Nexus Awaits</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md p-8 rounded-xl bg-[rgba(13,13,13,0.8)] backdrop-blur-xl border border-red-900/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-8 text-center">
            <h2 className="font-orbitron text-3xl font-bold mb-2">WELCOME BACK</h2>
            <p className="font-rajdhani text-gray-400 uppercase tracking-widest">Enter Your Credentials</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-rajdhani uppercase tracking-wider text-gray-300">Email Sequence</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="player@nexus.com"
                        autoComplete="email"
                        {...field}
                        className="bg-black/50 border-gray-800 focus-visible:ring-red-600 focus-visible:border-red-600 font-inter"
                        data-testid="input-login-email"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-rajdhani" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-rajdhani uppercase tracking-wider text-gray-300">Access Code</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                          className="bg-black/50 border-gray-800 focus-visible:ring-red-600 focus-visible:border-red-600 font-inter pr-10"
                          data-testid="input-login-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 font-rajdhani" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isLoading}
                data-testid="button-login-submit"
                className="w-full py-4 bg-gradient-to-r from-[#8B0000] to-[#B11226] hover:from-[#a00000] hover:to-[#cc152b] rounded text-white font-orbitron font-bold tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(139,0,0,0.4)] hover:shadow-[0_0_30px_rgba(177,18,38,0.6)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 size={16} className="animate-spin" /> AUTHENTICATING...</> : "LOGIN"}
              </button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-4">
            <p className="font-inter text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/signup" className="text-red-500 hover:text-red-400 transition-colors font-semibold">
                Create one
              </Link>
            </p>
            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded text-xs font-inter text-gray-400">
              Demo account: demo@gameatlas.gg / demo1234
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
