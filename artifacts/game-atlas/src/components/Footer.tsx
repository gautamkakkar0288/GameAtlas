import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-[#050505] pt-32 pb-12 relative z-10 border-t border-red-900/20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="w-full h-[1px] bg-red-500 absolute top-20"></div>
        <div className="w-[1px] h-full bg-red-500 absolute left-20"></div>
        <div className="w-[1px] h-full bg-red-500 absolute right-20"></div>
      </div>

      <div className="container mx-auto px-8 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 lg:col-span-2">
            <h2 className="font-orbitron text-3xl font-black tracking-widest mb-6">
              GAME<span className="text-red-600">ATLAS</span>
            </h2>
            <p className="font-inter text-gray-500 max-w-sm mb-8">
              The unified nexus of gaming. Your library, your stats, your community, forged into one powerful entity.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Discord', 'YouTube', 'Twitch'].map((social) => (
                <a key={social} href="#" className="font-rajdhani uppercase text-sm tracking-widest text-gray-400 hover:text-red-500 transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-rajdhani uppercase tracking-widest font-bold text-white mb-6">Platform</h4>
            <ul className="space-y-4 font-inter text-sm text-gray-500">
              <li><a href="#" className="hover:text-red-500 transition-colors">Download Client</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Cloud Gaming</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-rajdhani uppercase tracking-widest font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 font-inter text-sm text-gray-500">
              <li><a href="#" className="hover:text-red-500 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 font-inter text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} GameAtlas Nexus. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
