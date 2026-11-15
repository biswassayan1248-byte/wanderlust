// Slow-rotating globe in the homepage hero, drawn with three.js (loaded from a
// CDN in boilerplate.ejs). Falls back to a plain background if three.js
// didn't load, or if the person asked the browser to reduce motion.
(function () {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || typeof THREE === "undefined") return;

    const hero = canvas.closest(".hero");
    let width = hero.clientWidth;
    let height = hero.clientHeight;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // wireframe sphere — the "globe"
    const wireGeo = new THREE.IcosahedronGeometry(2.6, 3);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xc9a24b,
        wireframe: true,
        transparent: true,
        opacity: 0.22
    });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // a faint solid core so the globe reads as an object, not just lines
    const coreGeo = new THREE.SphereGeometry(2.55, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x0d0d10,
        transparent: true,
        opacity: 0.85
    });
    globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // scattered points across the globe stand in for destinations
    const destinations = [];
    const pointCount = 90;
    for (let i = 0; i < pointCount; i++) {
        const phi = Math.acos(1 - 2 * ((i + 0.5) / pointCount));
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        destinations.push(
            new THREE.Vector3(
                2.62 * Math.sin(phi) * Math.cos(theta),
                2.62 * Math.sin(phi) * Math.sin(theta),
                2.62 * Math.cos(phi)
            )
        );
    }
    const pointsGeo = new THREE.BufferGeometry().setFromPoints(destinations);
    const pointsMat = new THREE.PointsMaterial({
        color: 0xe8cd8a,
        size: 0.05,
        transparent: true,
        opacity: 0.85
    });
    globeGroup.add(new THREE.Points(pointsGeo, pointsMat));

    // a handful of thin arcs, like flight paths between a few of the points
    for (let i = 0; i < 5; i++) {
        const a = destinations[Math.floor(Math.random() * destinations.length)];
        const b = destinations[Math.floor(Math.random() * destinations.length)];
        const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(3.6);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const arcGeo = new THREE.TubeGeometry(curve, 32, 0.006, 6, false);
        const arcMat = new THREE.MeshBasicMaterial({
            color: 0xc9a24b,
            transparent: true,
            opacity: 0.35
        });
        globeGroup.add(new THREE.Mesh(arcGeo, arcMat));
    }

    globeGroup.position.set(2.1, -0.3, 0);
    globeGroup.rotation.x = 0.35;

    let targetRotY = 0;
    let pointerX = 0;

    hero.addEventListener("pointermove", (e) => {
        const rect = hero.getBoundingClientRect();
        pointerX = (e.clientX - rect.left) / rect.width - 0.5;
        targetRotY = pointerX * 0.25;
    });

    let frame;
    function animate() {
        globeGroup.rotation.y += 0.0022 + (targetRotY - globeGroup.rotation.y) * 0.01;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
    }
    animate();

    function resize() {
        width = hero.clientWidth;
        height = hero.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        // move the globe off-canvas on narrow screens so it sits behind the text softly
        globeGroup.position.x = width < 760 ? 0.6 : 2.1;
    }
    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("beforeunload", () => cancelAnimationFrame(frame));
})();
