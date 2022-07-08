kaboom({
  fullscreen: true,
  clearColor: [0.3, 1, 1, 1],
  global: true,
  scale: 2,
});
loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("spong", "spongebob.png");
loadSprite("surprise", "surprise.png");
loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("ppp", "pipe_up.png");

let score = 0;

scene("game", () => {
  play("gameSound");

  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                                                                                                                          ",
    "                                                                                                                                                          ",
    "                                                                                                                                                          ",
    "                                                                                                                                                          ",
    "                                                                                                                                                          ",
    "                                                                                                                                                          ",
    "                                                                                                                                                          ",
    "                                                                                                                                                          ",
    "                                                                                                      v                                                    ",
    "                          v                                                                                                                                ",
    "                                                                == $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$               e                                                                           ",
    "                        v                                           ==============================================                                                                                       ",
    "                                        m                                                                                                                 ",
    "                       v           =                       ==                                                                                                ",
    "                               =         =            ==                                                                                                      ",
    "                            =                    ==                                                              m                                            ",
    "                     v   ==                  ==                                                              =                                              ",
    "           m                                                                      $                     ==                                                  ",
    "                  ee                                                                                        ====        p                                     ",
    "======================================== ============   =======  =====",
  ];
  const mapSymbols = {
    width: 20,
    height: 20,

    "=": [sprite("block"), solid()],
    $: [sprite("coin"), solid(), "coins"],
    v: [sprite("surprise"), solid(), "surprise_coin"],
    m: [sprite("surprise"), solid(), "surprise_mushroom"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    w: [sprite("mushroom"), solid(), "mushroom", body()],
    e: [sprite("evil_mushroom"), solid(), "evil_mushroom", body()],
    p: [sprite("ppp"), solid(), "ppp"],
  };
  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("spong"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score :" + score)]);

  keyDown("right", () => {
    player.move(120, 0);
  });

  keyDown("left", () => {
    player.move(-120, 0);
  });

  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(400);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      console.log(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }

    if (obj.is("surprise_mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("w", obj.gridPos.sub(0, 1));
    }
  });
  action("mushroom", (obj) => {
    obj.move(20, 0);
  });

  player.collides("coins", (obj) => {
    score += 5;
    destroy(obj);
  });

  player.collides("mushroom", (obj) => {
    destroy(obj);
    player.biggify(20);
  });
  player.collides("ppp", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });

  const FALL_DOWN = 700;

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score:" + score;
    if (player.pos.y >= FALL_DOWN) {
      go("lose");
    }
    camPos(player.pos);
  });
  action("evil_mushroom", (obj) => {
    obj.move(-20, 0);
  });
  let isJumping = false;
  player.collides("evil_mushroom", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      go("lose");
    }
  });

  player.action(() => {
    isJumping = !player.grounded();
  });
});

scene("lose", () => {
  score = 0;
  add([
    text("space to restart , 20"),
    text("GAME OVER\n TRY AGIN", 60),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

scene("win", () => {
  score = 0;
  add([
    text("space to restart , 20"),
    text("You Won", 60),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

start("game");
