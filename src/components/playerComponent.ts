import { AnimationComponent, BaseComponent, keyboardController, Scene } from "bare-engine";

enum State
{
    Idle,
    Walk
}

export class PlayerComponent extends BaseComponent
{
    state:State;
    animationComponent: AnimationComponent;
    speed = 3;

    constructor(scene:Scene)
    {
        super(scene);
    }

    OnAdded(): void
    {
        this.animationComponent = this.go.GetComponent(AnimationComponent);
        this.SetState(State.Idle);
    }

    OnUpdate(deltaTime: number): void
    {
        if (keyboardController.IsLeftDown())
        {
            this.go.flipped = true;
            this.go.SetPosition(this.go.x - this.speed, this.go.y);
            this.SetState(State.Walk);
        }
        else
        if (keyboardController.IsRightDown())
        {
            this.go.flipped = false;
            this.go.SetPosition(this.go.x + this.speed, this.go.y);
            this.SetState(State.Walk);
        }
        else
        {
            this.SetState(State.Idle);
        }

        this.HandleState();
    }

    HandleState()
    {
        switch (this.state)
        {
            case State.Idle:

            break;
            case State.Walk:
            break;
        }
    }

    SetState(state: State)
    {
        if (this.state === state)
            return;

        this.state = state;

        switch (this.state)
        {
            case State.Idle:
                this.animationComponent.Play('idle');
            break;
            case State.Walk:
                this.animationComponent.Play('walk');
            break;
        }
    }
}
