function AchievementsManager () {
  this.achievements = AchievementsManager.achievements;
  this.events = {};
  this.container = document.querySelector(".achievements-container");
  this.popupRemoveDelay = 5100;
}

AchievementsManager.achievements = {};
AchievementsManager.register = function (achievement) {
  achievement.isUnlocked = false;

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
  var achievement,
    unlocked = false;
  for (var title in this.achievements) {
    achievement = this.achievements[title];
    if (!achievement.isUnlocked && achievement.update(this, eventType, data)) {
      unlocked = true;
      this.unlock(achievement);
    }
  }
  if (unlocked) {
    this.emit("update");
  }
};

AchievementsManager.prototype.update = function () {
  this.recieve();
};

AchievementsManager.prototype.unlock = function (achievement) {
  achievement.isUnlocked = true;
  this.show(achievement);
  this.emit("unlock", achievement);
};

AchievementsManager.prototype.show = function (achievement) {
  var item = document.createElement("li");
  item.classList.add("achievement");
  
  var itemTitle = document.createElement("div");
  itemTitle.classList.add("achievement-title");
  itemTitle.textContent = achievement.title;

  item.appendChild(itemTitle);
  this.container.appendChild(item);

  var self = this;
  setTimeout(function () {
    self._remove(item);
  }, this.popupRemoveDelay);
};
AchievementsManager.prototype._remove = function (el) {
  this.container.removeChild(el);
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