# Achievements contributing
- First of all you need to fork this repo. Fork from gh-pages branch because I don't want to mess with two branches.
- Go to /js/achievements.js and add your achievement. You might need some js coding experience.
- Create pull request and wait =)

## How to add new achevement
Achievement system is pretty simple so maybe you'll need to improve it in order to be able to add your new achievement.
All you need is to register your achievement in AchievementManager object like this:
```
AchievementsManager.register({
  title: "First step",
  description: "Make your first tile move",
  update: function (manager, eventType, data) {
    return eventType == "move" && data.moved;
  }
});
```
- `title` is the title of your achievement. It will be shown in popup when achevement is unlocked.
- `description` is the detailed description. It will be shown in achievements list.
- `update` is the function called some game events (see below).
  - `manager` is a reference to `AchievementManager` instance
  - `eventType` is a type of game event (see below)
  - `data` is object with event data (or undefined)

## Game events
Here is detailed `eventType` description:

### "init"
Game have been initialized. Triggers once per window session.

`data` is undefined.

### "start"
Game has been started (or restarted).

`data`:
- `previousState` serialized previous game state. Game has been restarted if it's empty.

### "move"
Player made a move.

`data`:
- `direction`
- `moved` if false that means move haven't been performed

### "tileMove"
Triggers by every tile that moved.

`data`:
- `direction`
- `moved` if false that means tile haven't really moved
- `tile` reference to tile object

### "merge"
Triggers by every tile merge.

`data`:
- `direction`
- `tile` reference to tile object that have been consumed
- `merged` reference to tile object that consumed another

### "loose"
Game over.

`data` is undefined

### "win"
Player reached 2048 tile.

`data` is undefined
