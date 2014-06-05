var Haxfred,
    fs = require('fs'),
    _ = require('lodash');

var haxfred_irc_legacy_personality = function(haxfred) {
  Haxfred = haxfred;

  // Looks for a file to pull random phrases from
  // If it can't be found, creates one.

  var randomPhrases = Haxfred.config.randomPhrasePath || "./randomPhrases";

  if(!fs.existsSync(randomPhrases)) {
    console.log("Could not find the randomPhrases file. Building randomPhrases file");
    var file = fs.createWriteStream(randomPhrases),
        phrases = [ "The battleline between good and evil runs through the heart of every man.",
                    "How can you expect a man who's warm to understand one who's cold?",
                    "Nice weather, eh?",
                    "<whistles yankee doodle dandee>",
                    "Get your facts first, then you can distort them as you please.",
                    "Only those who will risk going too far can possibly find out how far one can go.",
                    "St. Aquinas was a perl monk",
                    "Ruby is for hipsters",
                    "Totally",
                    "I see nothing unethical in the job it does. Why shouldn't you send a copy of some music to a friend?",
                    "I'm always happy when I'm protesting.",
                    "'Free software' is a matter of liberty, not price. To understand the concept, you should think of 'free' as in 'free speech,' not as in 'free beer'.",
                    "For personal reasons, I do not browse the web from my computer. (I also have not net connection much of the time.) To look at page I send mail to a demon which runs wget and mails the page back to me. It is very efficient use of my time, but it is slow in real time.",
                    "Playfully doing something difficult, whether useful or not, that is hacking.",
                    "Copying all or parts of a program is as natural to a programmer as breathing, and as productive. It ought to be as free.",
                    "All you need is love."];
    file.on('error', function(err) { console.log(err);});
    phrases.forEach(function(v) { file.write(v + '\n'); });
    file.end();
    console.log("Phrase Selection Complete");
  }

  // Pass in an array to return a random selection from it
  var getRandom = function(list) {
      rand = _.random(0, list.length -1); // last one is always left out. not sure if this is a huge drawback or not
      return list[rand];
  }


  /* ----- Haxfred Listeners ----- */
  haxfred.on('irc.privateMsg', '', function(data, deferred) {
    var from = data.from;

    haxfred.irc.say("thanks for thinking of me", from);

    deferred.resolve();
  });

  haxfred.on('irc.join', '', function(data, deferred) {
    var from = data.from;

    if (haxfred.irc.client.nick !== from) {
        haxfred.irc.say("Hey there, " + from + " welcome to " + Haxfred.config.channels[0] + "!");
    }

    deferred.resolve();
  });

  haxfred.on('irc.directMsg', '', function(data, deferred) {

    fs.readFile(randomPhrases, 'utf8', function(err, data) {
      if (err) throw err;
      var list = data.split(/\r?\n/);
      haxfred.irc.say(getRandom(list));
    });

    deferred.resolve();
  });

};

module.exports = haxfred_irc_legacy_personality;
