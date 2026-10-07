import { GameObject, Scene, TextObject } from "bare-engine";

export class UI extends Scene
{
    coins: number = 0;
    coinObj!: GameObject;
    coinTextObj!: TextObject;
    
    constructor()
    {
        super({UI: true, persistent: true});
    }
    
    async OnAwake()
    {
        // LOAD CUSTOM FONT
        await Promise.all([
            bare.LoadFont('Qilka-Bold'),
            bare.asset.LoadTexture('HUD/hudCoin')
        ]);
            
        var marge = 12;
        
        // COIN IMAGE
        this.coinObj = this.AddGameObject("HUD/hudCoin")
            .SetScale(.5)
            .SetPosition(marge, marge);

        // COIN TEXT
        this.coinTextObj = new TextObject(this, {
            fontSize: 56,
            fill: '#c8a104'
        });
        this.AddGameObject(this.coinTextObj)
            .SetPosition(marge + 52, marge + 1);
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
