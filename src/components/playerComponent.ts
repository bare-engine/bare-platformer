import { AnimationComponent, BaseComponent, keyboardController, PhysicsObjectBare, Scene } from "bare-engine";

enum State
{
    Idle,
    Walk,
    Jump
}

export class PlayerComponent extends BaseComponent<PhysicsObjectBare>
{
    state:State;
    animationComponent: AnimationComponent;

    moveSpeed = 500;
    jump = -1600;

    OnAdded(): void
    {
        this.animationComponent = this.go.GetComponent(AnimationComponent);
        this.SetState(State.Idle);
    }

    OnUpdate(deltaTime: number): void
    {
        // WALK
        if (keyboardController.IsLeftDown())
        {
            this.go.flipped = true;
            this.go.velocity.x = -this.moveSpeed;

            if (this.go.IsGrounded())
                this.SetState(State.Walk);
        }
        else
        if (keyboardController.IsRightDown())
        {
            this.go.flipped = false;
            this.go.velocity.x = this.moveSpeed;

            if (this.go.IsGrounded())
                this.SetState(State.Walk);
        }
        else
        {
            this.go.velocity.x = 0;
        }

        // JUMP
        if (this.go.IsGrounded() && (keyboardController.IsUpPressed() || keyboardController.IsKeyPressed(' ')))
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
