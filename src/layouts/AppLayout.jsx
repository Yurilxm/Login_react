import Particles from "@tsparticles/react";
import ParticlesBackground from "../components/ParticlesBackground";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Depois entra Topbar, Sidebar etc */}
      {children}

      <ParticlesBackground />
    </div>
  )
}