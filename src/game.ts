import settingsData from '../public/assets/data/settingsData.json';
import { AnimationComponent, BareEvent, cameraHandler, CameraScaleMode, ParticleComponent, PhysicsControllerBare, Scene, sceneController, soundHandler, StartBare } from 'bare-engine';
import { CollectableComponent } from './components/collectableComponent';
import { PlayerComponent } from './components/playerComponent';
import { DebugController } from './controllers/debugController';
import { UI } from './ui';

declare global
{
    var game: Game;
    var debugController:DebugController;
}

export class Game extends Scene
{
    uiScene: UI;
    
    constructor()
    {
        // TELLING BARE ABOUT OUR SETTINGS
        // EG: HOW ENTITIES ARE SETUP (player/block/collectable)
        super(settingsData);

        window.game = this;
    }
    
    async OnAwake()
    {
        // LOAD CUSTOM FONT
        const font = new FontFace('Qilka-Bold', 'url("/assets/fonts/Qilka-Bold.otf")');
        await font.load();
        (document.fonts as any).add(font);

        // IMPORT THIS TO ENABLE PHYSICS
        this.AddClass(PhysicsControllerBare);

        // IMPORT COMPONENTS WE USE IN THE LEVEL
        this.AddClass(PlayerComponent);
        this.AddClass(AnimationComponent);
        this.AddClass(CollectableComponent);
        this.AddClass(ParticleComponent);

        // ADD THIS TO HOOK UP SOME DEBUG KEYS: FOR RESTART AND TOGGLING DEBUG VISUALS
        window.debugController = new DebugController(this);
        
        // ADDING OUR OWN UI SCENE - SHOWING THE COINS COLLECTED
        this.uiScene = await sceneController.Add(UI);
    }

    //THIS METHOD IS ALSO CALLED ON RESTART
    async OnStart()
    {
        // LOAD THE LEVEL
        await this.levelHandler.LoadLevel('level');

        // SET CAMERA TO FIT THE LEVEL
        cameraHandler.SetScaleMode(CameraScaleMode.Contain);
        cameraHandler.SetDimensionsToLevel();

        // RESET COINS
        this.uiScene.SetCoinAmount(0);

        // KEEP TRACK OF COINS
        var totalCoins = this.componentController.GetComponentsByType(CollectableComponent).length;
        
        // LISTEN TO CUSTOM COIN COLLECTED EVENT - WIN WHEN NONE LEFT
        this.events.on("collectableCollected", async ({collectable}) => {
            this.uiScene.AddCoin();

            totalCoins--;
            if (totalCoins == 0)
            {
                await wait(.4);
                this.Win();
            }
        });

        // LISTEN TO PLAYER COLLISION - LOSE WHEN COLLIDES WITH SOMETHING TAGGED AS DANGEROUS (SAW)
        var player = this.objectController.GetObjectByName("player");
        player.events.on(BareEvent.collision_start, async (object) => {
            if (object.tags.includes("dangerous"))
            {
                player.SetColor("#ff9b9b");
                this.Lose();
            }
        });
    }

    Win()
    {
        soundHandler.playSound("win", {volume: .2});

        var flag = this.objectController.GetObjectByName("flagYellow");
        var anim = flag.GetComponent(AnimationComponent);
        anim.Play('up');
    }

    async Lose()
    {
        soundHandler.playSound("lose", {volume: .4});

        await this.Sleep(.75);
        this.Restart();
    }
}

// START THE BARE ENGINE!
// PROVIDING Game AS STARTING SCENE
StartBare(Game, {editorButtonPosition: {x:.5, y: 0}});