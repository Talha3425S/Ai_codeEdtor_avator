import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function ThreeAvatarScene({ speaking }) {
  const mountRef = useRef(null)
  const speakingRef = useRef(speaking)

  useEffect(() => {
    speakingRef.current = speaking
  }, [speaking])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0, 0.35, 5.2)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const skin = new THREE.MeshStandardMaterial({
      color: 0x70d6ff,
      roughness: 0.38,
      metalness: 0.08,
    })
    const visor = new THREE.MeshStandardMaterial({
      color: 0x102033,
      roughness: 0.22,
      metalness: 0.35,
    })
    const accent = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.28,
      metalness: 0.18,
    })
    const glow = new THREE.MeshStandardMaterial({
      color: 0xa7f3d0,
      emissive: 0x0f766e,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    })
    const mouthMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.42,
    })

    const head = new THREE.Mesh(new THREE.SphereGeometry(1.05, 48, 32), skin)
    head.scale.set(1, 1.08, 0.92)
    head.position.y = 0.66
    group.add(head)

    const visorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.42, 0.34, 0.12),
      visor,
    )
    visorMesh.position.set(0, 0.86, 0.86)
    group.add(visorMesh)

    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), glow)
    leftEye.position.set(-0.36, 0.89, 0.93)
    group.add(leftEye)

    const rightEye = leftEye.clone()
    rightEye.position.x = 0.36
    group.add(rightEye)

    const mouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.055, 0.08),
      mouthMaterial,
    )
    mouth.position.set(0, 0.62, 0.93)
    group.add(mouth)

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.38, 32), accent)
    neck.position.y = -0.28
    group.add(neck)

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 0.9, 8, 32), visor)
    torso.position.y = -1.02
    torso.scale.set(1.08, 0.78, 0.72)
    group.add(torso)

    const core = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), glow)
    core.position.set(0, -0.98, 0.67)
    group.add(core)

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.016, 12, 96),
      new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        emissive: 0x2563eb,
        emissiveIntensity: 0.25,
      }),
    )
    ring.position.y = -0.16
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.28, 1.45, 0.12, 64),
      new THREE.MeshStandardMaterial({
        color: 0xdbeafe,
        roughness: 0.55,
        metalness: 0.05,
      }),
    )
    base.position.y = -1.74
    group.add(base)

    const ambient = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 2.4)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
    keyLight.position.set(2.4, 3.2, 4.5)
    scene.add(keyLight)

    const sideLight = new THREE.PointLight(0x38bdf8, 2.4, 8)
    sideLight.position.set(-2.8, 0.7, 2.4)
    scene.add(sideLight)

    const resize = () => {
      const { clientWidth, clientHeight } = mount
      const width = Math.max(clientWidth, 1)
      const height = Math.max(clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    const clock = new THREE.Clock()
    let animationFrame = 0

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      const isSpeaking = speakingRef.current
      const mouthScale = isSpeaking ? 1 + Math.abs(Math.sin(elapsed * 14)) * 2.2 : 1

      group.rotation.y = Math.sin(elapsed * 0.65) * 0.14
      group.position.y = Math.sin(elapsed * 1.2) * 0.05
      mouth.scale.y = mouthScale
      mouth.scale.x = isSpeaking ? 1.08 + Math.sin(elapsed * 8) * 0.08 : 1
      core.scale.setScalar(isSpeaking ? 1.05 + Math.sin(elapsed * 7) * 0.08 : 1)
      ring.rotation.z = elapsed * 0.6
      ring.scale.setScalar(isSpeaking ? 1 + Math.sin(elapsed * 5) * 0.025 : 1)
      glow.emissiveIntensity = isSpeaking ? 1.2 + Math.sin(elapsed * 8) * 0.25 : 0.82

      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      renderer.dispose()
      mount.removeChild(renderer.domElement)

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
  }, [])

  return <div className="avatar-stage" ref={mountRef} aria-label="3D speaking avatar" />
}

export default ThreeAvatarScene
