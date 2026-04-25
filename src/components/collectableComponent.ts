import { BaseComponent, PhysicsObjectBare, type GameObject } from "bare-engine";

export class CollectableComponent extends BaseComponent<PhysicsObjectBare>
{
    OnCollisionStart(initiatingObject: GameObject, collidingObject: GameObject): void
    {
        this.go.Remove();
        trace(4)
    }
}
