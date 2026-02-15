# Qandy Pocket Computer running QUEVILLE.js  
Open Source by Quintrix and Crew Software

An emulator for a retro computer that never existed.

**Team**  
- Joe: Lead Programmer  
- QuaCzar: Programmer  

**Special thanks to**  
USMarine, DarthKitty, Pixie, BeYondZer, Lawlers, Spike, Guard, Dana, and all the thousands of players who have encouraged me to continue writing this game. As far as I'm concerned, it belongs to you as much as it belongs to me, which is why it is now Open Source.

---

## Getting Started

Visit the [Qandy GitHub Pages site](https://quintrix.github.io/qandy/) for the running demo and documentation.

### Main files and documentation

- [index.htm](https://quintrix.github.io/qandy/index.htm): Links to all .htm pages
- [qandy.htm](https://quintrix.github.io/qandy/qandy.htm): Qandy Pocket Computer running QUEVILLE.js
- [demo.htm](https://quintrix.github.io/qandy/demo.htm): Qandy Pocket Computer embedded with demo.js
- [queville.htm](https://quintrix.github.io/qandy/queville.htm): Tandy Pocket Computer emulating Queville v.Zero

#### Supporting scripts and assets

- [qandy-tileset.htm](https://quintrix.github.io/qandy/qandy-tileset.htm): Displays all graphics in the qandy-gfx.js script
- qandy-gfx.js: Qandy graphics, image src strings
- qandy-itemid.js: ItemID(item) function, returns item name
- queville.js: Queville ported to Qandy        
- demo.js: Queville v.Zero ported to Qandy

#### Readme and reference

- [qandy-readme.txt](https://quintrix.github.io/qandy/qandy-readme.txt): Notes on qandy.htm
- [queville-readme.txt](https://quintrix.github.io/qandy/queville-readme.txt): Notes on queville.js

#### Screenshot

- [first boot.png](https://quintrix.github.io/qandy/first%20boot.png): Screenshot of first successful boot

---

## Deployment

This project is deployed via **GitHub Pages** at [https://quintrix.github.io/qandy/](https://quintrix.github.io/qandy/).

**Note**: Automatic Vercel deployments are disabled (see `vercel.json`) to conserve deployment quota. Changes are automatically deployed to GitHub Pages when merged to the main branch. If you need to deploy to Vercel manually, use the Vercel CLI:

```bash
vercel --prod
```

---

If you have suggestions or want to contribute, open an issue or fork the repo!
