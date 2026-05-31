import { AnimationComponent, Component, InspectorField, keyboardController, Label, Locked } from "bare-engine";
import { ArcadeObject } from "bare-engine/arcade";

enum State
{
    Idle,
    Walk,
    Jump
}

export class PlayerComponent extends Component<ArcadeObject>
{
    state:State;
    animationComponent: AnimationComponent;

    moveSpeed = 500;
    jump = -1600;

    @InspectorField
    @Locked
    @Label('State')
    playerState = {
        get: () => State[this.state],
        set: (state: string) => this.SetState(State[state as keyof typeof State])
    };

    OnAdded(): void
    {
        this.animationComponent = this.go.GetComponent(AnimationComponent);
        this.SetState(State.Idle);
    }

    OnUpdate(deltaTime: number): void
    {
        // WALK
        var moveX = (dir:number) =>
        {
            this.go.flipped = (dir < 0);
            this.go.velocity.x = (dir * this.moveSpeed);

            if (this.go.IsGrounded())
                this.SetState(State.Walk);
        }
        
        if (keyboardController.IsLeftDown())
        {
            moveX(-1);
        }
        else
        if (keyboardController.IsRightDown())
        {
            moveX(1);
        }
        else
        {
            this.go.velocity.x = 0;
        }

        // JUMP
        if (this.go.IsGrounded() && (keyboardController.IsUpPressed() || keyboardController.IsKeyPressed('space')))
        {
            this.go.velocity.y = this.jump;
            this.SetState(State.Jump);
        }
        
        // IDLE
        if(this.go.velocity.isZero())
        {
            this.SetState(State.Idle);
        }
    }

    SetState(state: State)
    {
        if (this.state == state)
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
            case State.Jump:
                this.animationComponent.Play('jump');
            break;
        }
    }
}
