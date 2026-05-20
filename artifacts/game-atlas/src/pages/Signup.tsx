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
import { SiSteam, SiEpicgames } from "react-icons/si";

const signupSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters" }),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username: letters, numbers, underscores only",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { displayName: "", username: "", email: "", password: "", confirmPassword: "" },
  });

  const togglePlatform = (platform: string) => {
    setPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const user = await auth.registerWithApi({
        email: values.email,
        username: values.username,
        password: values.password,
        displayName: values.displayName,
      });
      setUser(user);
      toast({ title: "Account Created!", description: `Welcome to GameAtlas, ${user.displayName ?? user.username}!` });
      setLocation("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast({ title: "Registration Failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-row-reverse bg-[#050505] text-white overflow-hidden">
      <div className="hidden lg:flex flex-1 relative items-center justify-center border-l border-red-900/30">
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
            JOIN <span className="text-red-600">NEXUS</span>
          </h1>
          <p className="font-rajdhani text-2xl text-gray-400 tracking-[0.3em] uppercase">Forge Your Legacy</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md p-8 rounded-xl bg-[rgba(13,13,13,0.8)] backdrop-blur-xl border border-red-900/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] my-8"
        >
          <div className="mb-8 text-center">
            <h2 className="font-orbitron text-3xl font-bold mb-2">CREATE ACCOUNT</h2>
            <p className="font-rajdhani text-gray-400 uppercase tracking-widest">Initialize Profile</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-rajdhani uppercase tracking-wider text-gray-300 text-xs">Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Player One" {...field} className="bg-black/50 border-gray-800 focus-visible:ring-red-600 font-inter" />
                      </FormControl>
                      <FormMessage className="text-red-400 font-rajdhani text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-rajdhani uppercase tracking-wider text-gray-300 text-xs">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="player_one" {...field} className="bg-black/50 border-gray-800 focus-visible:ring-red-600 font-inter" />
                      </FormControl>
                      <FormMessage className="text-red-400 font-rajdhani text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-rajdhani uppercase tracking-wider text-gray-300">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="player@nexus.com" autoComplete="email" {...field} className="bg-black/50 border-gray-800 focus-visible:ring-red-600 font-inter" />
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
                          autoComplete="new-password"
                          {...field}
                          className="bg-black/50 border-gray-800 focus-visible:ring-red-600 font-inter pr-10"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-rajdhani uppercase tracking-wider text-gray-300">Verify Code</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                        className="bg-black/50 border-gray-800 focus-visible:ring-red-600 font-inter"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-rajdhani" />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <p className="font-rajdhani uppercase tracking-wider text-gray-300 text-sm mb-3">Link Platforms (Optional)</p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => togglePlatform('steam')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded border ${platforms.includes('steam') ? 'bg-[#1b2838] border-[#66c0f4] text-white shadow-[0_0_15px_rgba(102,192,244,0.3)]' : 'bg-black/50 border-gray-800 text-gray-500'} transition-all`}
                  >
                    <SiSteam size={20} /> <span className="font-rajdhani font-bold">Steam</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePlatform('epic')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded border ${platforms.includes('epic') ? 'bg-[#2a2a2a] border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-black/50 border-gray-800 text-gray-500'} transition-all`}
                  >
                    <SiEpicgames size={20} /> <span className="font-rajdhani font-bold">Epic</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-6 bg-gradient-to-r from-[#8B0000] to-[#B11226] hover:from-[#a00000] hover:to-[#cc152b] rounded text-white font-orbitron font-bold tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(139,0,0,0.4)] hover:shadow-[0_0_30px_rgba(177,18,38,0.6)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 size={16} className="animate-spin" /> CREATING ACCOUNT...</> : "JOIN GAMEATLAS"}
              </button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="font-inter text-sm text-gray-500">
              Already initialized?{' '}
              <Link href="/login" className="text-red-500 hover:text-red-400 transition-colors font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
