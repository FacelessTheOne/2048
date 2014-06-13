function AchievementsManager () {
  this.achievements = AchievementsManager.achievements;
  this.events = {};
}

AchievementsManager.achievements = {};
AchievementsManager.register = function (achievement) {
  achievement.isUnlocked = false;
  achievement.isShown = false;
  this.achievements[achievement.title] = achievement;
};

AchievementsManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

AchievementsManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

AchievementsManager.prototype.recieve = function (eventType, data) {
  var _this = this,
    achievement;
  for (var title in this.achievements) {
    achievement = this.achievements[title];
    if (!achievement.isUnlocked && achievement.check(eventType, data)) {
      _this.unlock(achievement);
    }
  }
};

AchievementsManager.prototype.unlock = function (achievement) {
  achievement.isUnlocked = true;
  this.emit("unlock", achievement);
  console.log("Achievement unlocked: %s", achievement.title);
};

AchievementsManager.prototype.unserialize = function (data) {
  if (data) {
    var _this = this;
    for (var title in data) {
      if (this.achievements[title]) {
        this.achievements[title].isUnlocked = data[title].isUnlocked;
        this.achievements[title].isShown = data[title].isShown;
      }
    }
  }
};

AchievementsManager.prototype.serialize = function () {
  var res = {};
  for (var title in this.achievements) {
    res[title] = {
      isUnlocked: this.achievements[title].isUnlocked,
      isShown: this.achievements[title].isShown
    }
  }
  return res;
};