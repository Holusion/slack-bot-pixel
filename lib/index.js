'use strict';
const Botkit = require("botkit");

const exec = require("child_process").exec;

const token = process.env.SLACK_API_TOKEN || ''; //see section above on sensitive data
const controller = Botkit.slackbot({
    debug: false,
});
var bot = controller.spawn({
    token: token
}).startRTM();


controller.hears(["visites .*pixel"],['direct_message','message_received'],
  function(bot, message) {
    console.log("Matched message : ",message);
    exec(`cat /var/log/nginx/access.log |grep "GET / "|wc -l`,function(error,stdout,stderr){
      if(error){
        bot.reply(message,"J'ai planté ^_^' - "+stderr);
      }else{
        let count = stdout.substr(0,stdout.length-1);
        bot.reply(message, `Il y a eu ${count} visite${(1<count)?"s":""} aujourd'hui.`);
      }

    })

  }
);
