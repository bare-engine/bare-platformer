import { BaseComponent, Easing, ParticleComponent, PhysicsObjectBare, TweenTo, type GameObject } from "bare-engine";
import { soundHandler } from "bare-engine/sound";

export class CollectableComponent extends BaseComponent<PhysicsObjectBare>
{
    OnStart(): void
    {
        // FLOAT UP AND DOWN
        TweenTo(this.go, .4, {delay: Math.random() * .2, innerY: "+=" + 10, ease: Easing.Sinusoidal.InOut, yoyo: true, repeat: -1});
    }

    async OnCollisionStart(collidingObject: GameObject): Promise<void>
    {
        if (collidingObject.name != "player")
            return;

        bare.events.emit("collectableCollected", {collectable: this.go});

        // GET COLLECTABLE - PLAY SOUND, FLOAT UP, REMOVE
        soundHandler.playSound("coin", {volume: 0.1});

        this.go.GetComponent(ParticleComponent).Fire();

        this.go.collide = false;
        await TweenTo(this.go, 1, { alpha: 0, scale: 1.4, innerY: "-=" + 200 }).promise;

        this.go.Remove();
    }
}
