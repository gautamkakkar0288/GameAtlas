import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ghost, Home } from "lucide-react";

const NotFound = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#04050F] text-center text-slate-100 p-6 relative overflow-hidden">

            {/* Background Glows */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <Ghost size={120} className="mx-auto mb-8 text-cyan-400 opacity-80" strokeWidth={1} />

                <h1 className="mb-4 text-7xl font-black tracking-tight text-white md:text-9xl drop-shadow-2xl">
                    4<span className="text-purple-500">0</span>4
                </h1>

                <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-200">
                    Glitch in the Matrix
                </h2>

                <p className="mx-auto mb-10 max-w-md text-slate-400 text-lg">
                    The page or game you are looking for has been moved, deleted, or never existed in this realm.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 text-base font-black text-white transition-transform hover:scale-[1.05] shadow-[0_0_20px_rgba(109,40,217,0.4)]"
                >
                    <Home size={18} /> Return to Base
                </Link>
            </motion.div>
        </main>
    );
};

export default NotFound;