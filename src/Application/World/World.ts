import * as THREE from 'three';
import Application from '../Application';
import Resources from '../Utils/Resources';
import ComputerSetup from './Computer';
import MonitorScreen from './MonitorScreen';
import Environment from './Environment';
import Decor from './Decor';
import CoffeeSteam from './CoffeeSteam';
import Cursor from './Cursor';
import Hitboxes from './Hitboxes';
import DeskItems from './DeskItems';
import AudioManager from '../Audio/AudioManager';
import UIEventBus from '../UI/EventBus';
export default class World {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;

    // Objects in the scene
    environment: Environment;
    decor: Decor;
    computerSetup: ComputerSetup;
    monitorScreen: MonitorScreen;
    coffeeSteam: CoffeeSteam;
    cursor: Cursor;
    audioManager: AudioManager;
    deskItems: DeskItems;

    // Interaction
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    currentIntersect: THREE.Intersection | null = null;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.environment = new Environment();
            this.decor = new Decor();
            this.computerSetup = new ComputerSetup();
            this.monitorScreen = new MonitorScreen();
            this.coffeeSteam = new CoffeeSteam();
            this.audioManager = new AudioManager();
            this.deskItems = new DeskItems();
            // const hb = new Hitboxes();
            // this.cursor = new Cursor();
            this.initInteraction();
        });
    }

    update() {
        if (this.monitorScreen) this.monitorScreen.update();
        if (this.environment) this.environment.update();
        if (this.coffeeSteam) this.coffeeSteam.update();
        if (this.audioManager) this.audioManager.update();
    }

    // Add interaction logic
    initInteraction() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        let lastX = 0;
        let lastY = 0;
        let lastTime = Date.now();
        let lastTooltipTime = 0;

        window.addEventListener('mousemove', (e) => {
            // Glitch Trigger Logic
            const now = Date.now();
            const dt = now - lastTime;
            if (dt > 50) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                const speed = Math.sqrt(dx * dx + dy * dy) / dt;
                if (speed > 3.5) {
                    this.application.renderer.triggerGlitch(150);
                }
                lastX = e.clientX;
                lastY = e.clientY;
                lastTime = now;
            }

            // Raycaster Mouse Update
            this.mouse.x = (e.clientX / this.application.sizes.width) * 2 - 1;
            this.mouse.y = -(e.clientY / this.application.sizes.height) * 2 + 1;

            // Hover Check
            this.checkIntersection();
        });

        window.addEventListener('mousedown', () => {
            // Basic click sound for feedback
            // this.audioManager.playAudio('mouse_click', { volume: 0.5 }); // Assuming audio mapping exists
            // Using console log as placeholder if unsure about audio key, but sticking to plan
        });

        window.addEventListener('click', (e) => {
            // Prevent interaction if already inside computer
            if (this.monitorScreen.inComputer) return;

            if (this.currentIntersect) {
                // Feedback: Shake/Glitch
                this.application.renderer.triggerGlitch(100);

                // Sound logic
                this.audioManager.playAudio('mouseDown');

                switch (this.currentIntersect.object.name) {
                    case 'enterHotspot':
                        document.body.style.cursor = 'default';
                        this.application.camera.trigger('enterMonitor');
                        break;
                    case 'gameboy':
                        console.log('Gameboy Clicked');
                        break;
                    case 'coffee':
                        console.log('Coffee Clicked');
                        break;
                    case 'keyboard':
                        console.log('Keyboard Clicked - *Clack*');
                        this.application.renderer.triggerGlitch(300);
                        break;
                }
            } else {
                // Tooltip Logic (Throttled)
                const now = Date.now();
                if (now - lastTooltipTime > 3000) {
                    UIEventBus.dispatch('showTooltip', {
                        text: "Zona no interactiva. Probá el monitor.",
                        x: e.clientX,
                        y: e.clientY
                    });
                    lastTooltipTime = now;
                }
            }
        });
    }



    checkIntersection() {
        if (!this.application.camera.instance) return;

        // Disable hover interaction if in computer
        if (this.monitorScreen.inComputer) {
            document.body.style.cursor = 'default';
            this.currentIntersect = null;
            return;
        }

        this.raycaster.setFromCamera(this.mouse, this.application.camera.instance);

        // Intersect with all objects in the scene
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            // Filter for specific interactable objects
            const interactables = ['gameboy', 'coffee', 'keyboard', 'enterHotspot'];
            const hit = intersects.find(intersect => {
                const name = intersect.object.name; // Keep case sensitive for enterHotspot, or use .toLowerCase
                return interactables.includes(name) || interactables.some(term => name.toLowerCase().includes(term));
            });

            if (hit) {
                this.currentIntersect = hit;
                document.body.style.cursor = 'pointer';

                // Optional: visual feedback on hover for hotspot
                if (hit.object.name === 'enterHotspot') {
                    // Could twitch it or brighten it
                }

            } else {
                this.currentIntersect = null;
                document.body.style.cursor = 'default';
            }
        } else {
            this.currentIntersect = null;
            document.body.style.cursor = 'default';
        }
    }
}
