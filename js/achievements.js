//привет
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