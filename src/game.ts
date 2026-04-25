import settingsDataJson from '../public/assets/data/settingsData.json';

import { AnimationComponent, BarePlugin, cameraHandler, CameraScaleMode, GameObject, LevelData, PhysicsObjectBare, Scene, StartBare, TweenTo } from 'bare-engine';
import { PlayerComponent } from './components/playerComponent';
import { DebugController } from './controllers/debugController';
import { PhysicsControllerBare } from 'bare-engine/barePhysics';

declare global
{
    var game: Game;
    var debugController:DebugController;
}

export class Game extends Scene
{
    player: GameObject;
    
    constructor()
    {
        super(settingsDataJson);
        window.game = this;

        // UNCOMMENT TO ENABLE PLUGIN
        if (__DEV__)
            this.AddClass(BarePlugin);

        this.AddClass(PlayerComponent);
        this.AddClass(AnimationComponent);
        this.AddClass(PhysicsControllerBare);

        window.debugController = new DebugController(this);
    }

    async OnStart()
    {
        this.levelHandler.LoadLevel('level');
    }

    override OnAfterLoadedLevel(level:LevelData)
    {
        cameraHandler.SetScaleMode(CameraScaleMode.Contain);
        cameraHandler.SetBoundsToScreen();
        cameraHandler.SetDimensionsToLevel();
    }
    
    override OnFixedUpdate(): void
    {
    }
}

StartBare(Game);