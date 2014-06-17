function AchievementsManager () {
  this.achievements = AchievementsManager.achievements;
  this.events = {};
  this.container = document.querySelector(".achievements-container");
  this.listContainer = document.querySelector(".achievements-list-container");
  this.popupRemoveDelay = 5000;
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
  var self = this;

  var item = document.createElement("li");
  item.classList.add("achievement");
  
  var itemTitle = document.createElement("div");
  itemTitle.classList.add("achievement-title");
  itemTitle.textContent = achievement.title;

  item.addEventListener("click", function () {
    self.showList(achievement);
  }, false);

  item.appendChild(itemTitle);
  this.container.appendChild(item);

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

AchievementsManager.prototype.showList = function (highlightAchievement) {
  var list = this.listContainer.querySelector('.achievements-list');
  while (list.hasChildNodes()) {
    list.removeChild(list.lastChild);
  }
  var firstLockedItem,
    achievement,
    item, itemInner, itemTitle, itemDescription, itemTweet,
    isHighlighted;
  for (var title in this.achievements) {
    achievement = this.achievements[title];

    isHighlighted = highlightAchievement && achievement.title === highlightAchievement.title;

    item = document.createElement("li");
    item.classList.add("achievement");
    item.classList.add(achievement.isUnlocked ? "unlocked" : "locked");

    itemInner = document.createElement("li");
    itemInner.classList.add("achievement-inner");

    if (isHighlighted) {
      item.classList.add("highlighted");
    }

    itemTitle = document.createElement("div");
    itemTitle.classList.add("achievement-title");
    itemTitle.textContent = achievement.title;
    itemInner.appendChild(itemTitle);

    itemDescription = document.createElement("div");
    itemDescription.classList.add("achievement-description");
    itemDescription.textContent = achievement.description;
    itemInner.appendChild(itemDescription);

    item.appendChild(itemInner);

    if (achievement.isUnlocked) {
      itemTweet = document.createElement("a");
      itemTweet.classList.add("twitter-share-button");
      itemTweet.classList.add("achievement-tweet");
      itemTweet.setAttribute("href", "https://twitter.com/share");
      itemTweet.setAttribute("data-url", "http://facelesstheone.github.io/2048achievements/");
      itemTweet.setAttribute("data-count", "none");
      itemTweet.textContent = "Tweet";
      itemTweet.setAttribute("data-text", "I unlocked achievement \"" + achievement.title + "\" in 2048 game! #2048achievements");
      itemInner.appendChild(itemTweet);

      list.insertBefore(item, isHighlighted ? list.firstChild : firstLockedItem);
    } else {
      firstLockedItem = firstLockedItem || item;
      list.appendChild(item);
    }
  }

  document.body.style.overflowY = "hidden";

  this.listContainer.classList.add('shown');

  twttr.widgets.load();
};

AchievementsManager.prototype.hideList = function () {
  this.listContainer.classList.remove('shown');

  document.body.style.overflowY = "";
};
