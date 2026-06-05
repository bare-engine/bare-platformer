import settingsData from '../public/data/settingsData.json';
import { AnimationComponent, BareEvent, cameraHandler, CameraScaleMode, LevelData, ParticleComponent, Scene, sceneController, soundHandler, StartBare } from 'bare-engine';
import { ArcadePhysicsController, ArcadeObject } from "bare-engine/arcade";
import { CollectableComponent } from './components/collectableComponent';
import { PlayerComponent } from './components/playerComponent';
import { UI } from './ui';

declare global
{
    var game: Game;
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
    {//
        // IMPORT THIS TO ENABLE PHYSICS
        bare.AddClass(ArcadeObject);
        bare.AddClass(ArcadePhysicsController);

        // IMPORT COMPONENTS WE USE IN THE LEVEL
        bare.AddClass(PlayerComponent);
        bare.AddClass(AnimationComponent);
        bare.AddClass(CollectableComponent);
        bare.AddClass(ParticleComponent);
        
        // ADDING OUR OWN UI SCENE - SHOWING THE COINS COLLECTED
        this.uiScene = await sceneController.Add(UI);
        
        // ADD A BUTTON TO GO TO LEVEL EDITOR - VISIBLE FOR PLAYERS IN PRODUCTION BUILD
        //sceneController.Add(EditorUIScene);
    }

    //THIS METHOD IS ALSO CALLED ON RESTART
    async OnStart()
    {
        // LOAD THE LEVEL
        await this.LoadLevel('level');
    }

    override OnPostLoadLevel(level: LevelData): void
    {
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
        player.events.on(BareEvent.collision_start, (object) => {
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
StartBare(Game, {editorButtonPosition: {x:.5, y: 0}, showEditorButton: true});
