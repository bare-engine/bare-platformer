import settingsDataJson from '../public/assets/data/settingsData.json';

import { AnimationComponent, BarePlugin, GameObject, PhysicsObjectBare, Scene, StartBare } from 'bare-engine';
import { PlayerComponent } from './components/playerComponent';
import { DebugController } from './controllers/debugController';

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

        window.debugController = new DebugController(this);
    }

    async OnStart()
    {
        /*var player = new PhysicsObjectBare(this, 'player');
        this.player = this.AddGameObject(player)
            .SetPosition(bare.width * .5, bare.height * .5)
            
        var animComponent = this.player.AddComponent(AnimationComponent);
        await animComponent.Play('idle');
        this.player.SetPivot(.5, 1);

        var playerComponent = this.player.AddComponent(PlayerComponent, animComponent);*/

        this.player = this.AddGameObject('player')
            .SetPosition(bare.width * .5, bare.height * .5);

    }

    override OnFixedUpdate(): void
    {
    }
}

StartBare(Game);