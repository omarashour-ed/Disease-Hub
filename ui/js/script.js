



// Taken from https://codepen.io/enesser/pen/jdenE



function main() {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );


    let webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000000, 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = true;

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    document.querySelector("#WebGL-output").append(webGLRenderer.domElement);

    let step = 0;

    let knot;

    let controls = new (function () {
        this.radius = 40;
        this.tube = 17;
        this.radialSegments = 186;
        this.tubularSegments = 4;
        this.p = 9;
        this.q = 1;
        this.heightScale = 4;
        this.asParticles = true;
        this.rotate = true;

        this.redraw = function () {
            if (knot) scene.remove(knot);

            let geom = new THREE.TorusKnotGeometry(
                controls.radius,
                controls.tube,
                Math.round(controls.radialSegments),
                Math.round(controls.tubularSegments),
                Math.round(controls.p),
                Math.round(controls.q),
                controls.heightScale
            );

            if (controls.asParticles) {
                knot = createParticleSystem(geom);
            } else {
                knot = createMesh(geom);
            }

            scene.add(knot);
        };
    })();

    let gui = new dat.GUI();
    gui.add(controls, "radius", 0, 40).onChange(controls.redraw);
    gui.add(controls, "tube", 0, 40).onChange(controls.redraw);
    gui.add(controls, "radialSegments", 0, 400).step(1).onChange(controls.redraw);
    gui.add(controls, "tubularSegments", 1, 20).step(1).onChange(controls.redraw);
    gui.add(controls, "p", 1, 10).step(1).onChange(controls.redraw);
    gui.add(controls, "q", 1, 15).step(1).onChange(controls.redraw);
    gui.add(controls, "heightScale", 0, 5).onChange(controls.redraw);
    gui.add(controls, "asParticles").onChange(controls.redraw);
    gui.add(controls, "rotate").onChange(controls.redraw);

    gui.close();

    controls.redraw();

    render();

    function generateSprite() {
        let canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;

        let context = canvas.getContext("2d");
        let gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        );
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.2, "rgb(149,255,0)");
        gradient.addColorStop(0.4, "rgb(0,64,5)");
        gradient.addColorStop(1, "rgba(0,0,0,1)");

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createParticleSystem(geom) {
        let material = new THREE.ParticleBasicMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: generateSprite()
        });

        let system = new THREE.ParticleSystem(geom, material);
        system.sortParticles = true;
        return system;
    }

    function createMesh(geom) {
        let meshMaterial = new THREE.MeshNormalMaterial({});
        meshMaterial.side = THREE.DoubleSide;

        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

        return mesh;
    }

    function render() {
        if (controls.rotate) {
            knot.rotation.y = step += 0.00058;
        }

        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }
}
$(document).ready(function() {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

    /* Main navigation */
    let panelsSection = document.querySelector("#panels"),
        panelsContainer = document.querySelector("#panels-container"),
        tween;
    console.log(panelsContainer);

    let scrollFunc = ScrollTrigger.getScrollFunc(window);

    document.querySelectorAll(".anchor").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            let targetElem = document.querySelector(e.target.getAttribute("href")),
                y = targetElem;
            if (targetElem && panelsContainer.isSameNode(targetElem.parentElement)) {
                let totalScroll = tween.scrollTrigger.end - tween.scrollTrigger.start,
                    totalMovement = (panels.length - 1) * targetElem.offsetWidth;
                y = Math.round(tween.scrollTrigger.start + (targetElem.offsetLeft / totalMovement) * totalScroll);
            }
            gsap.to(window, {
                scrollTo: {
                    y: y,
                    autoKill: false
                },
                onStart: () => scrollFunc.cacheID = Math.random(),
                onUpdate: ScrollTrigger.update,
                duration: 1
            });
        });
    });

    /* Panels */
    const panels = gsap.utils.toArray("#panels-container .panel");
    tween = gsap.to(panels, {
        xPercent: -100 * ( panels.length - 1 ),
        ease: "none",
        scrollTrigger: {
            trigger: "#panels-container",
            pin: true,
            start: "top top",
            scrub: 1,
            anticipatePin: 1,
            snap: {
                snapTo: 1 / (panels.length - 1),
                inertia: false,
                duration: {min: 0.1, max: 0.1}
            },
            end: () =>  "+=" + (panelsContainer.offsetWidth - innerWidth)
        }
    });


//PARTICLE CODE from: https://codepen.io/nocni_sovac/pen/vYGoZpP
    main();
});