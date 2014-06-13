//привет
/**
* Events that can be recieved by achievements
*
* eventType   data                          info
* -----------|-----------------------------|---------------------------------------
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
  check: function (eventType, data) {
    return eventType == "move" && data.moved;
  }
});

AchievementsManager.register({
  title: "That’s how it goes",
  description: "Make your first tiles merge",
  check: function (eventType, data) {
    return eventType == "merge";
  }
});

AchievementsManager.register({
  title: "I’m bitter",
  description: "Loose for the first time",
  check: function (eventType, data) {
    return eventType == "loose";
  }
});

AchievementsManager.register({
  title: "One does not simply stop playing",
  description: "Keep playing after reaching 2048 tile",
  check: function (eventType, data) {
    return eventType == "keepPlaying";
  }
});

AchievementsManager.register({
  title: "It’s not my day",
  description: "Loose 5 times in a row",
  looseCount: 0,
  check: function (eventType, data) {
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
  check: function (eventType, data) {
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
  check: function (eventType, data) {
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
  check: function (eventType, data) {
    return eventType == "merge" && data.merged.value == 1024;
  }
});

AchievementsManager.register({
  title: "Look, mom, I did it!",
  description: "Reach 2048",
  check: function (eventType, data) {
    return eventType == "merge" && data.merged.value == 2048;
  }
});

AchievementsManager.register({
  title: "I did it again",
  description: "Reach 2048 twice",
  winCount: 0,
  check: function (eventType, data) {
    if (eventType == "merge" && data.merged.value == 2048) {
      return ++this.winCount == 2;
    }
  }
});

AchievementsManager.register({
  title: "Mad skillz",
  description: "Reach 4096",
  check: function (eventType, data) {
    return eventType == "merge" && data.merged.value == 4096;
  }
});

AchievementsManager.register({
  title: "Like a bawse",
  description: "Reach more than 4096",
  check: function (eventType, data) {
    return eventType == "merge" && data.merged.value > 4096;
  }
});

AchievementsManager.register({
  title: "So slow",
  description: "Make no moves for 1 minute",
  lastTimestamp: null,
  check: function (eventType, data) {
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
  check: function (eventType, data) {
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
  check: function (eventType, data) {
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
  check: function (eventType, data) {
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
  check: function (eventType, data) {
    if (eventType == "start") {
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
