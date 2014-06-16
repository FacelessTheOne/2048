/**
* Events that can be recieved by achievements
*
* eventType   data                          info
* -----------|-----------------------------|---------------------------------------
* "init"
* "start"     previousState                 Game started
* "move"      direction, moved              One move performed
* "tileMove"  direction, moved, tile        One move performed by certain tile
* "merge"     direction, tile, merged       Two tiles merged
* "loose"                                   Game over
* "win"                                     2048 reached
*/

AchievementsManager.register({
  title: "First step",
  description: "Make your first tile move",
  update: function (manager, eventType, data) {
    return eventType == "move" && data.moved;
  }
});

AchievementsManager.register({
  title: "That’s how it goes",
  description: "Make your first tiles merge",
  update: function (manager, eventType, data) {
    return eventType == "merge";
  }
});

AchievementsManager.register({
  title: "I’m bitter",
  description: "Loose for the first time",
  update: function (manager, eventType, data) {
    return eventType == "loose";
  }
});

AchievementsManager.register({
  title: "One does not simply stop playing",
  description: "Keep playing after reaching 2048 tile",
  update: function (manager, eventType, data) {
    return eventType == "keepPlaying";
  }
});

AchievementsManager.register({
  title: "It’s not my day",
  description: "Loose 5 times in a row",
  looseCount: 0,
  update: function (manager, eventType, data) {
    if (eventType == "loose") {
      return ++this.looseCount >= 5;
    } else if (eventType == "win") {
      this.looseCount = 0;
    }
  }
});

AchievementsManager.register({
  title: "No time to waste",
  description: "Make 10 moves in 3 seconds",
  movesCount: 0,
  lastTimestamp: null,
  update: function (manager, eventType, data) {
    if (eventType == "move" && data.moved) {
      var date = new Date(),
        delta = this.lastTimestamp ? date - new Date(this.lastTimestamp) : 0;
      if (!this.lastTimestamp || delta > 3000) {
        this.lastTimestamp = date;
        this.movesCount = 1;
      } else {
        return ++this.movesCount == 10;
      }
    }
  }
});

AchievementsManager.register({
  title: "Highly efficient",
  description: "Make 10 merges in 5 seconds",
  mergesCount: 0,
  lastTimestamp: null,
  update: function (manager, eventType, data) {
    if (eventType == "merge") {
      var date = new Date(),
        delta = this.lastTimestamp ? date - new Date(this.lastTimestamp) : 0;
      if (!this.lastTimestamp || delta > 5000) {
        this.lastTimestamp = date;
        this.mergesCount = 1;
      } else {
        return ++this.mergesCount == 10;
      }
    }
  }
});

AchievementsManager.register({
  title: "Half the way",
  description: "Reach 1024",
  update: function (manager, eventType, data) {
    return eventType == "merge" && data.merged.value == 1024;
  }
});

AchievementsManager.register({
  title: "Look, mom, I did it!",
  description: "Reach 2048",
  update: function (manager, eventType, data) {
    return eventType == "merge" && data.merged.value == 2048;
  }
});

AchievementsManager.register({
  title: "I did it again",
  description: "Reach 2048 twice",
  winCount: 0,
  update: function (manager, eventType, data) {
    if (eventType == "merge" && data.merged.value == 2048) {
      return ++this.winCount == 2;
    }
  }
});

AchievementsManager.register({
  title: "Mad skillz",
  description: "Reach 4096",
  update: function (manager, eventType, data) {
    return eventType == "merge" && data.merged.value == 4096;
  }
});

AchievementsManager.register({
  title: "Like a bawse",
  description: "Reach more than 4096",
  update: function (manager, eventType, data) {
    return eventType == "merge" && data.merged.value > 4096;
  }
});

AchievementsManager.register({
  title: "So slow",
  description: "Make no moves for 1 minute",
  lastTimestamp: null,
  update: function (manager, eventType, data) {
    if (eventType == "start") {
      this.lastTimestamp = new Date();
    } else if (eventType == "move") {
      var date = new Date();
      if (date - new Date(this.lastTimestamp) >= 60 * 1000) {
        return true;
      } else {
        this.lastTimestamp = date;
      }
    }
  }
});

AchievementsManager.register({
  title: "Flash",
  description: "Reach 2048 in 3 minutes or less",
  lastTimestamp: null,
  update: function (manager, eventType, data) {
    if (eventType == "start" && !data.previousState) {
      this.lastTimestamp = new Date();
    } else if (eventType == "merge" && data.merged.value == 2048) {
      return new Date() - new Date(this.lastTimestamp) <= 3 * 60 * 1000;
    }
  }
});

AchievementsManager.register({
  title: "I don’t need more",
  description: "Reach 2048 unsing only 3 types of moves",
  directionsUsed: {},
  update: function (manager, eventType, data) {
    switch (eventType) {
      case "start":
        if (!data.previousState) {
          this.directionsUsed = {};
        }
        break;
      case "move":
        this.directionsUsed[data.direction] = true;
        break;
      case "merge":
        if (data.merged.value == 2048) {
          this.directionsUsed[data.direction] = true;
          var dirCount = 0;
          for (var dir in this.directionsUsed) {
            if (this.directionsUsed[dir]) ++dirCount;
          }
          return dirCount < 4;
        }
        break;
    }
  }
});

AchievementsManager.register({
  title: "No turning back",
  description: "Reach 2048 unsing only 2 types of moves",
  directionsUsed: {},
  update: function (manager, eventType, data) {
    switch (eventType) {
      case "start":
        if (!data.previousState) {
          this.directionsUsed = {};
        }
        break;
      case "move":
        this.directionsUsed[data.direction] = true;
        break;
      case "merge":
        if (data.merged.value == 2048) {
          this.directionsUsed[data.direction] = true;
          var dirCount = 0;
          for (var dir in this.directionsUsed) {
            if (this.directionsUsed[dir]) ++dirCount;
          }
          return dirCount < 3;
        }
        break;
    }
  }
});

AchievementsManager.register({
  title: "Every day job",
  description: "Play game every day for 5 days",
  lastTimestamp: null,
  count: 0,
  update: function (manager, eventType, data) {
    if (eventType == "init") {
      var date = new Date();
      if (!this.lastTimestamp || (date - new Date(this.lastTimestamp) >= 2 * 24 * 60 * 60 * 1000)) {
        this.lastTimestamp = date;
        this.count = 0;
      } else {
        this.lastTimestamp = new Date(this.lastTimestamp);
        if (this.lastTimestamp.getDate() != date.getDate()) {
          this.lastTimestamp = new Date();
          return ++this.count == 5;
        }
      }
    }
  }
});

AchievementsManager.register({
  title: "Fancy fruit",
  description: "Play with Apple mobile device",
  update: function (manager, eventType, data) {
    return eventType == "init" && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  }
});

AchievementsManager.register({
  title: "I am robot",
  description: "Play with Android device",
  update: function (manager, eventType, data) {
    return eventType == "init" && /Android/g.test(navigator.userAgent);
  }
});

AchievementsManager.register({
  title: "C-c-combo!",
  description: "Make 10 merges in a row",
  count: 0,
  update: function (manager, eventType, data) {
    switch (eventType) {
      case "start":
        if (!data.previousState) {
          this.count = 0;
        }
        break;
      case "merge":
        return ++this.count == 10;
      case "move":
        this.count = 0;
        break;
    }
  }
});

AchievementsManager.register({
  title: "Not safe for work",
  description: "Switch to another tab or another window",
  res: false,
  update: function (manager, eventType, data) {
    if (eventType == "init") {
      var self = this,
        onFocusFn = function () {
          window.removeEventListener("focus", onFocusFn);
          self.res = true;
          manager.update();
        };
      window.addEventListener("focus", onFocusFn);
    }

    return this.res;
  }
});

AchievementsManager.register({
  title: "No :|",
  description: "Close or refresh game window in less than 2 seconds",
  res: false,
  lastTimestamp: null,
  update: function (manager, eventType, data) {
    if (eventType == "init") {
      this.lastTimestamp = new Date();

      var self = this,
        onUnloadFn = function () {
          self.delta = new Date() - self.lastTimestamp;
          if ((new Date() - self.lastTimestamp) < 2 * 1000) {
            self.res = true;
            manager.emit("update");
          }
        };
      window.addEventListener("unload", onUnloadFn);

      return this.res;
    }
  }
});
