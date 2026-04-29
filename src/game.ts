import settingsDataJson from '../public/assets/data/settingsData.json';
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
        super(settingsDataJson);
        window.game = this;
    }
    
    async OnAwake()
    {
        // LOAD CUSTOM FONT
        const font = new FontFace('Qilka-Bold', 'url("/assets/fonts/Qilka-Bold.otf")');
        await font.load();
        (document.fonts as any).add(font);

        this.AddClass(PlayerComponent);
        this.AddClass(AnimationComponent);
        this.AddClass(CollectableComponent);
        this.AddClass(ParticleComponent);
        this.AddClass(PhysicsControllerBare);

        window.debugController = new DebugController(this);
        
        this.uiScene = await sceneController.Add(UI);
    }

    //THIS METHOD IS CALLED ON START AND RESTART
    async OnStart()
    {
        // LOAD THE LEVEL
        await this.levelHandler.LoadLevel('level');

        // RESET COINS
        this.uiScene.SetCoinAmount(0);

        // KEEP TRACK OF COINS
        var totalCoins = this.componentController.GetComponentsByType(CollectableComponent).length;
        
        // LISTEN TO COIN COLLECTED - WIN WHEN NONE LEFT
        this.events.on("collectableCollected", async ({collectable}) => {
            this.uiScene.AddCoin();

            totalCoins--;
            if (totalCoins == 0)
            {
                await wait(.4);
                this.Win();
            }
        });

        // LISTEN TO PLAYER COLLISION - LOSE WHEN COLLIDES WITH SAW
        var player = this.objectController.GetObjectByName("player");
        player.events.on(BareEvent.collision_start, async (object) => {
            if (object.name == "saw")
            {
                player.SetColor("#ff9b9b");
                this.Lose();
            }
        });

        // SET CAMERA TO FIT LEVEL
        cameraHandler.SetScaleMode(CameraScaleMode.Contain);
        cameraHandler.SetDimensionsToLevel();
    }

    Win()
    {
        soundHandler.playSound("win", {volume: 0.2});

        var flag = this.objectController.GetObjectByName("flagYellow");
        var anim = flag.GetComponent(AnimationComponent);
        anim.Play('up');
    }

    async Lose()
    {
        soundHandler.playSound("lose", {volume: 0.4});

        await this.Sleep(.75);
        this.Restart();
    }
}

StartBare(Game, {editorButtonPosition: {x:.5, y: 0}});