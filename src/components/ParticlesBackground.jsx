import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

function ParticlesBackground() {
  const [engineReady, setEngineReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setEngineReady(true))
  }, [])

  if (!engineReady) return null

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 z-0"
      options={{
        fullScreen: { enable: false },

        particles: {
          number: {
            value: 200,
            density: {
              enable: true,
              area: 800,
            },
          },

          color: {
            value: "#ffffff",
          },

          opacity: {
            value: 0.25,
          },

          size: {
            value: { min: 1, max: 3 },
          },

          links: {
            enable: true,
            distance: 130,
            color: "#ffffff",
            opacity: 0.08,
            width: 1,
          },

          move: {
            enable: true,
            speed: 0.7,
            outModes: {
              default: "out",
            },
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse", // 👈 reage ao mouse
            },
          },
          modes: {
            repulse: {
              distance: 120,
              duration: 0.4,
            },
          },
        },

        detectRetina: true,
      }}
    />
  )
}

export default ParticlesBackground