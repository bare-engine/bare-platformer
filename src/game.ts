import { AnimationComponent, BareEvent, CameraScaleMode, LevelData, ParticleComponent, Scene, StartBare } from 'bare-engine';
import { ArcadeObject, ArcadePhysicsController } from "bare-engine/arcade";
import settingsData from '../public/data/settingsData.json';
import { CollectableComponent } from './components/collectableComponent';
import { UI } from './ui';

declare global
{
    var game: Game;
}

export class Game extends Scene
{
    uiScene!: UI;
    
    constructor()
    {
        // TELLING BARE ABOUT OUR SETTINGS
        // EG: HOW ENTITIES ARE SETUP (player/block/collectable)
        super({ settingsData: settingsData });

        window.game = this;
    }
    
    override async OnAwake()
    {
        // IMPORT THIS TO ENABLE PHYSICS
        bare.AddClass(ArcadePhysicsController);

        // IMPORT COMPONENTS WE USE IN THE LEVEL
        bare.AddClass(AnimationComponent);
        bare.AddClass(ParticleComponent);
        
        // ADDING OUR OWN UI SCENE - SHOWING THE COINS COLLECTED
        this.uiScene = await bare.scene.Add(UI);
        
        // ADD A BUTTON TO GO TO LEVEL EDITOR - VISIBLE FOR PLAYERS IN PRODUCTION BUILD
        //bare.scene.Add(EditorUIScene);
    }

    //THIS METHOD IS ALSO CALLED ON RESTART
    override async OnStart()
    {
        // LOAD THE LEVEL
        await this.LoadLevel('level');
    }

    override OnPostLoadLevel(level: LevelData): void
    {
        // SET CAMERA TO FIT THE LEVEL
        bare.camera.SetScaleMode(CameraScaleMode.Contain);
        bare.camera.SetDimensionsToLevel();

        // RESET COINS
        this.uiScene.SetCoinAmount(0);

        // KEEP TRACK OF COINS
        var totalCoins = bare.component.GetAllByType(CollectableComponent).length;
        
        // LISTEN TO CUSTOM COIN COLLECTED EVENT - WIN WHEN NONE LEFT
        this.events.off("collectableCollected");
        this.events.on("collectableCollected", async ({collectable}) => {
            this.uiScene.AddCoin();

            totalCoins--;
            if (totalCoins == 0)
            {
                if (!await this.Wait(.4))
                    return;
                this.Win();
            }
        });

        // LISTEN TO PLAYER COLLISION - LOSE WHEN COLLIDES WITH SOMETHING TAGGED AS DANGEROUS (SAW)
        var player = bare.object.GetByName("player")!;
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
        bare.sound.Play("win", {volume: .2});

        var flag = bare.object.GetByName("flagYellow")!;
        var anim = flag.GetComponent(AnimationComponent)!;
        anim.Play('up');
    }

    async Lose()
    {
        bare.sound.Play("lose", {volume: .4});

        await this.Sleep(.75);
        this.Restart();
    }
}

// START THE BARE ENGINE!
// PROVIDING Game AS STARTING SCENE
StartBare(Game, {editorButtonPosition: {x:.5, y: 0}, showEditorButton: true});
