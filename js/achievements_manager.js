function AchievementsManager () {
  this.achievements = AchievementsManager.achievements;
  this.events = {};
}

AchievementsManager.achievements = {};
AchievementsManager.register = function (achievement) {
  achievement.isUnlocked = false;
  achievement.isShown = false;

  var title = achievement.title,
    description = achievement.description;
  delete achievement.title;
  delete achievement.description;
  Object.defineProperty(achievement, 'title', {
    value: title
  });
  Object.defineProperty(achievement, 'description', {
    value: description
  });

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
        var achievement = data[title];
        for (var field in achievement) {
          this.achievements[title][field] = achievement[field];
        }
      }
    }
  }
};

AchievementsManager.prototype.serialize = function () {
  var res = {};
  for (var title in this.achievements) {
    res[title] = this.achievements[title];
  }
  return res;
};