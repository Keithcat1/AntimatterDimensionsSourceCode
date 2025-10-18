# Antimatter Dimensions
## Accessibility
This mod adds a screen-reader mode in options > visual. When off the game looks exactly like normal, but when on the UI (and only the UI) is changes to assume among other things that the player isn't using a mouse, such that the game is currently completable, although minor bugs remain.
Currently, tooltips show by default, glyphs can be moved using the keyboard, the entirely visual perks tree is replaced with a list of buttons similar to those used by infinity upgrades, statistics multiplier is now a keyboard friendly tree ETC. Additional help can be found in how to play.

## Run

To run the game locally, you will need to install
[Node.js](https://nodejs.org/) (LTS suggested).

First, run the following command in your terminal (or command line) while being
inside the checked out repository:

```
npm ci
```

After all the packages are installed, start up the game:

```
npm run serve
```

This will make the game served via your localhost, and the playable link will
be displayed in your terminal. The server **doesn't** need to be restarted
after you've made changes - just reload the page. The server **can**
occasionally crash, so check your terminal from time to time and run `serve`
again if needed.
