import { GameObject, Scene, TextObject } from "bare-engine";

export class UI extends Scene
{
    coins: number = 0;
    coinObj: GameObject;
    coinTextObj: TextObject;
    
    constructor()
    {
        super({UI: true, persistent: true});
    }
    
    async OnAwake()
    {
        // COIN IMAGE
        this.coinObj = this.AddGameObject("HUD/hudCoin")
            .CenterPivot()
            .SetScale(.5)
            .SetPosition(30, 30);

        // COIN TEXT
        this.coinTextObj = new TextObject(this, {
            fontSize: 50,
            fontFamily: 'Qilka-Bold',
            color: '#c8a104'
        });
        this.AddGameObject(this.coinTextObj)
            .CenterPivot()
            .SetPosition(77, 37);
    }

    SetCoinAmount(amount: number)
    {
        this.coins = amount;
        this.coinTextObj.SetText(amount.toString());
    }

    AddCoin(amount: number = 1)
    {
        this.SetCoinAmount(this.coins + amount);
    }
}