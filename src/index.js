const { Telegraf, Markup } = require('telegraf')
const fs = require('fs');



// Import the different classes
const {GetCommandText , GetCommandArgs} = require('./CommandsHelpers')
const NextEventInformation = require('./NextEventInformation');
const AdminList = require('./AdminList')
const RegisteredUsers = require('./RegisteredUsers')
const BanList = require('./BanList');
const DefaultUsers = require('./DefaultUsers');

// Init the bot
const bot = new Telegraf("5523522146:AAHeOvQ5rUoAubCm6l4JGYkdKzeK43TUUEg")


// Create the next event informations object
let next_event_informations = new NextEventInformation(); 
// Create the admin list manager
let admin_list = new AdminList();
// Create the registered users manager
let registered_users = new RegisteredUsers();
// Create the baned users manager
let baned_users = new BanList();



// Check if the user is an admin and display an error message if he is not
function CheckForAdmin(ctx) {
    if(admin_list.IsAdmin(ctx.message.from.username)) return true;
    else {
        ctx.reply("⛔️ You must be administrator to run this command!");
        return false;
    }
}

function IsBaned(ctx) {
    if( baned_users.IsBaned(ctx.message.from.username)) {
        ctx.reply("⛔️ You are banned from this bot! Please contact the administrators to get more information.");
        return true;
    }
    else {
        return false;
    }
}


// Get a user formated to be added to the list
function GetUser(ctx) {
    let user = {
        "is_friend": false,
        "display_name": ctx.message.from.first_name,
        "identifier": ctx.message.from.id,
        "chat_id": ctx.message.chat.id
    };
    return user;
}

// Get a friend of a user formated to be added to the list
function GetUserFriend(ctx, friend_name) {
    let user = {
        "is_friend": true,
        "friend_name": friend_name,
        "display_name": ctx.message.from.first_name,
        "identifier": ctx.message.from.id,
        "chat_id": ctx.message.chat.id
    };
    return user;
}




// Send a message at the given date to the given chat id
function SendMessageAtDate(chat_id, message, date) {
    // Get the current date
    let current_date = new Date();
    // Get the difference between the current date and the given date
    let difference = date.getTime() - current_date.getTime();
    // If the difference is negative, send the message now
    if(difference < 0) {
        bot.telegram.sendMessage(chat_id, message);
    }
    // Else, send the message after the difference
    else {
        setTimeout(function() {
            bot.telegram.sendMessage(chat_id, message);
        } , difference);
    }
}


// Send all the messages at the given date
function SendMessagesAtDate(messages, date) {
    // Get the current date
    let current_date = new Date();
    // Get the difference between the current date and the given date
    let difference = date.getTime() - current_date.getTime();

    // If the difference is negative, send the message now
    if(difference < 0) {
    }
    // Else, send the message after the difference
    else {
        setTimeout(function() {

        } , difference);
    }
}


// send a message to a given user by his username
function SendMessageToUser(chat_id, message) {
    bot.telegram.sendMessage(chat_id, message);
}

// Send the informations of all the registered users, the waiting list users and the admins
function SendMessagesInformation() {

}

// Sent a message to all the admins
function SendMessageToAdmins(message) {
    // Loop through all the administrators
    for(let i = 0; i < admin_list.admin_list.length; i++) {
        // Get the admin
        let admin = admin_list.admin_list[i];
        // Get the chat_id property of the admin
        let chat_id = admin.chat_id;
        // Send the message to the admin
        bot.telegram.sendMessage(chat_id, message);
    }
}





// When the bot is started
bot.start((ctx) => {
    // Check if the user is in the default user list.
    // if yes, get the chat id of the user and add it to the default user list
    
    // Get the user linked to the context
    let user = GetUser(ctx);

    // Create the default user list if it doesn't exist
    let default_users = new DefaultUsers();
    default_users.Load();

    // If the user is in the default user list
    if(default_users.IsDefaultUser(user)) {
        // Remove the user because his informations are not soo true
        default_users.RemoveUser(user);
        // Add the user with the refreshed chat id
        default_users.AddUser(user);

        // Save the default user list
        default_users.Save();
    }

    // If the user is an administrator
    if(admin_list.IsAdmin(ctx.message.from.username)) {
        admin_list.RemoveUser(user);
        admin_list.AddUser(user);
        admin_list.Save();
    }
});



bot.command("set_date", (ctx) => {
    // Check if the user is an admin or not
    if(CheckForAdmin(ctx) === false) return;

    // Try to parse the data and store the result of the function
    let result = next_event_informations.ParseDate(GetCommandText(ctx));
    if(result === true) {
        ctx.reply("✅ The next event date was set to : <b>" + next_event_informations.DateToString() + '</b>', {"parse_mode" : "HTML"});
    }
    else {
        ctx.reply("⛔️ Impossible to parse the date : <b>" + GetCommandText(ctx) + '</b>.\n\n<b>Format must be :</b> [year]-[mounth]-[day] [hour]:[minutes].\n<b>Example</b> :\n/set_date 2022-05-22 17:50', {"parse_mode" : "HTML"});
    }
});






// Start the bot
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))