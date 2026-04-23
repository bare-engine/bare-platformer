import { BareEvent, levelHandler, SaveData, Scene } from "bare-engine";

export class DebugController
{
    scene: Scene;
    
    constructor(scene: Scene)
    {
        this.scene = scene;
        
        if (!window.isLocalhost)
            return;
    
        events.persistent.on(BareEvent.key_pressed, ({ key }) => {
            if (key.toLocaleLowerCase() == "z")
            {
                window.debug = !window.debug;
            }
            if (key.toLocaleLowerCase() == "r")
            {
                if (!bareEngine.levelEditorOpen)
                {
                    SaveData.levelCache.clear();
                    levelHandler.RestartLevel();
                }
            }
            if (key.toLocaleLowerCase() == "t")
            {
                if (!bareEngine.levelEditorOpen)
                {
                    bareEngine.Restart();
                }
            }
        });
    }
}