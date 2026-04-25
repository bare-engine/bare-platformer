import settingsDataJson from '../public/assets/data/settingsData.json';

import { AnimationComponent, BarePlugin, cameraHandler, CameraScaleMode, GameObject, LevelData, ParticleComponent, Scene, sceneController, StartBare } from 'bare-engine';
import { PhysicsControllerBare } from 'bare-engine/barePhysics';
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
    player: GameObject;
    
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

        // UNCOMMENT TO ENABLE PLUGIN
        if (__DEV__)
            this.AddClass(BarePlugin);

        this.AddClass(PlayerComponent);
        this.AddClass(AnimationComponent);
        this.AddClass(CollectableComponent);
        this.AddClass(ParticleComponent);
        this.AddClass(PhysicsControllerBare);

        window.debugController = new DebugController(this);
        
        this.uiScene = await sceneController.Add(UI);

        this.events.on("collectableCollected", ({collectable}) => {
            this.uiScene.AddCoin();
        })
    }

    async OnStart()
    {
        this.uiScene.SetCoinAmount(0);
        this.levelHandler.LoadLevel('level');
    }

    override OnAfterLoadedLevel(level:LevelData)
    {
        cameraHandler.SetScaleMode(CameraScaleMode.Contain);
        cameraHandler.SetBoundsToScreen();
        cameraHandler.SetDimensionsToLevel();
    }
}

StartBare(Game);