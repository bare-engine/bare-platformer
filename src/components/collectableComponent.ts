import { Component, Easing, Inspector, ParticleComponent, TweenTo, type GameObject } from "bare-engine";
import { ArcadeObject } from "bare-engine/arcade";

export class CollectableComponent extends Component<ArcadeObject>
{
    OnStart(): void
    {
        // FLOAT UP AND DOWN
        this.go.innerY = -5;
        TweenTo(this.go, .4, {delay: Math.random() * .2, innerY: "+=" + 10, ease: Easing.Sinusoidal.InOut, yoyo: true, repeat: -1});
    }

    OnCollisionStart(collidingObject: GameObject): Promise<void>
    {
        if (collidingObject.name != "player")
            return;

        this.Collect();
    }

    @Inspector.Button
    async Collect()
    {
        // SEND OUT CUSTOM EVENT - Game.ts LISTENS TO THIS
        bScene.events.emit("collectableCollected", {collectable: this.go});

        // GET COLLECTABLE
        bare.sound.Play("coin", {volume: .1});

        this.go.GetComponent(ParticleComponent).Fire();

        this.go.collide = false;
        await TweenTo(this.go, 1, { alpha: 0, scale: 1.4, innerY: "-=" + 200 }).promise;

        this.go.Remove();
    }
}

