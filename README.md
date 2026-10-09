# Bare Platformer - Example

<img width="800" height="733" alt="platformer" src="https://github.com/user-attachments/assets/cb075741-8f79-462f-965e-88a13c4ec535" />

<h2>Getting Started</h2>
<ol>
    <li>Install <a href="https://nodejs.org/en/download">Node.js</a></li>
    <li>Click Code->"Download ZIP" - unzip</li>
    <li>Open the command line in the bare-platformer-main folder</li>
    <li>Run <code>npm install</code> + <code>npm run dev</code></li>
    <li>Ctrl-click the localhost URL shown in the command line.</li>
</ol>
<br>

<h2>Features:</h2>
<ul>
    <li>Player movement</li>
    <li>Player animation</li>
    <li>Gravity</li>
    <li>Level creation</li>
    <li>UI</li>
    <li>Sound</li>
    <li>Tweens</li>
    <li>Collision and tags</li>
    <li>Asset streaming</li>
    <li>Custom events</li>
    <li>Particles</li>
    <li>Inspector buttons</li>
    <li>Dynamic resolution - filling window</li>
</ul>
<br>
<h3> On asset streaming</h3>
All the level and animation images are streamed in, to showcase the feature. However, this is not necessarily the fastest. Pre-loading an atlas can be faster (see <a href="https://github.com/bare-engine/bare-rpg">Bare RPG</a>). It depends on your use case.<br><br>If you're loading lots of new assets every level, you might want to stream them in (place them in public/images/), else you preload them (place them in texturePackImages). You could also combine both approaches and preload your most used images and streaming in the rest. 
<br><br>To try preloading here: rename <code>texturePackImagesDisabled</code> to <code>texturePackImages</code> and run <code>npm run dev</code>. The images are packed into an atlas and all assets are now preloaded.
