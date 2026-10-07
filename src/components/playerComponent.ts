import { AnimationComponent, Component, Inspector, InspectorField, SerializeField } from "bare-engine";
import { ArcadeObject } from "bare-engine/arcade";
import { Data } from "../generated/assets";

enum State
{
    Idle,
    Walk,
    Jump
}

export class PlayerComponent extends Component<ArcadeObject>
{
    state!: State;
    animationComponent!: AnimationComponent;

    @SerializeField
    @Inspector.Limit(0, Infinity)
    moveSpeed = 500;

    @SerializeField
    jump = -1600;

    @InspectorField
    @Inspector.Label('State')
    @Inspector.Locked
    playerState = {
        get: () => State[this.state],
        set: (state: string) => this.SetState(State[state as keyof typeof State])
    };

    OnAdded(): void
    {
        this.animationComponent = this.go.GetComponent(AnimationComponent)!;
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
        
        if (bare.keyboard.IsLeftDown())
        {
            moveX(-1);
        }
        else
        if (bare.keyboard.IsRightDown())
        {
            moveX(1);
        }
        else
        {
            this.go.velocity.x = 0;
        }

        // JUMP
        if (this.go.IsGrounded() && (bare.keyboard.IsUpPressed() || bare.keyboard.IsKeyPressed('space')))
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
                this.animationComponent.Play(Data.Animation.PLAYER_IDLE);
            break;
            case State.Walk:
                this.animationComponent.Play(Data.Animation.PLAYER_WALK);
            break;
            case State.Jump:
                this.animationComponent.Play(Data.Animation.PLAYER_JUMP);
            break;
        }

        // OR:
        //this.animationComponent.Play(State[this.state].toLowerCase());
    }
}

