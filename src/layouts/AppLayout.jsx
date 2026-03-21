import Particles from "@tsparticles/react";
import ParticlesBackground from "../components/ParticlesBackground";

export default function AppLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-zinc-900 text-white">
      
      <div className="relative z-10">
        {children}
      </div>

      <ParticlesBackground />

    </div>
  )
}