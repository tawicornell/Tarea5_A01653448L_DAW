// Imports
const express = require("express");
const webRoutes = require("./routes/web");

// Session imports
let cookieParser = require("cookie-parser");
let session = require("express-session");
let flash = require("express-flash");
let passport = require("passport");

// Express app creation
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

// Configurations
const appConfig = require("./configs/app");

// View engine configs
const exphbs = require("express-handlebars");
const hbshelpers = require("handlebars-helpers");
const multihelpers = hbshelpers();
const extNameHbs = "hbs";
const hbs = exphbs.create({
  extname: extNameHbs,
  helpers: multihelpers,
});
app.engine(extNameHbs, hbs.engine);
app.set("view engine", extNameHbs);

// Session configurations
let sessionStore = new session.MemoryStore();
app.use(cookieParser());
app.use(
  session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: "true",
    secret: appConfig.secret,
  })
);
app.use(flash());

// Configuraciones de passport
require("./configs/passport");
app.use(passport.initialize());
app.use(passport.session());

// Receive parameters from the Form requests
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", webRoutes);

names = [
  
  "Sandrarex", "IHasThighs", "Sandra Hairy Thighs", "Sandraasaurus Rex", "Sandra Charming Teeth", "Sandra American",
  "Uber Hairy Bear", "Disguised Bear", "HairyThighsOMG", "CharmingThighsLOL", "IntelligentThighsOMG", "HairyTeethLOL", "CharmingTeethOMG",
  "IntelligentTeethLMAO", "Iamhairy", "Iamcharming", "Iamintelligent", "IamSandra", "BearMilk",
  "Sandra Intelligent Bear", "MindOfSandra", "Gamerbear", "The Hairy Gamer", "The Charming Gamer", "The Intelligent Gamer", "DrHairy", "SandraThighspopper", "BigHairyBear",
  "ItIsYeBear", "S4ndr4", "Bear Boy", "Bear Girl", "Bear Person", "Captain Hairy",
  "IHasTeeth", "Total Bear", "The Hairy American Dude", "The Gaming Bear", "Gaming With Sandra", "Mr Game Bear", "Ms Game Bear"
  
  ];
  

letters = [
  "a", "b", "c", "d", "e", "f",
  "g","h","i","j","k","l","m",
  "n", "o","p","q","r","s","t",
  "u", "v", "w", "x", "y", "z",
];

shuffle(names);
players = [];
i = 0;
gameHasStarted = false;
gameAnswers = [];
date = "";

io.on("connection", function (socket) {
  console.log("New User!");
  players.push(names[0]);
  socket.emit("playerName", { playerName: names[0] });
  shuffle(names)
  if (!gameHasStarted) {
    io.emit("updatePlayers", { players: players });
    i++;
  }


  if (players.length > 1 && !gameHasStarted) {
    if (date == "") {
      // date.setMinutes(date.getMinutes() + 1);
      //date.setSeconds(date.getSeconds() + 10);
      date="today"
      let timer = 10;
      let x = setInterval(function () {
        console.log(timer);
        io.emit("updateTimer",{timer})
        timer--;
        if (timer < 0) {
          clearInterval(x);
          io.emit("startGame");
          console.log("START GAME");
          gameHasStarted = true;
        }
      }, 1000);
    }
    shuffle(letters);
    io.emit("theLetterIs", { letter: letters[0] });
    console.log("the Letter Is", letters[0]);
  }



  socket.on("basta", function (data) {
    if (gameAnswers.length == 0) {
      io.emit("basta");
      let timer = 11;
      var x = setInterval(function () {
        console.log(timer);
        timer--;
        if (timer < 0) {
          clearInterval(x);
          console.log(gameAnswers);
          io.emit("answers", { gameAnswers, gameAnswers });
          gameHasStarted = false;
          date = ""; 
          gameAnswers = [];
        }
      }, 1000);
    }
    gameAnswers.push(data.answers);
    console.log(data.answers);
  });

  socket.on("disconnect", function () {
    i--;
    if (i == 0) {
      gameAnswers = [];
      gameHasStarted = false;
      date = ""; 
      console.log("session is empty");
    }
    console.log("Got disconnect!");
    io.emit("checkPlayers");
    players = [];
  });

  socket.on("addPlayer", function (data) {
    players.push(data.playerName);
    if (!gameHasStarted) {
      io.emit("updatePlayers", { players: players });
    }
    console.log(players);
  });
});

http.listen(4200, function () {
  console.log("listening on localhost:4200");
});

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
