// Get the arguments of a command as a splited array of string
let GetCommandArgs = function (ctx) {
    const text = ctx.message.text.toLowerCase();
    if (text.startsWith('/')) {
        const match = text.match(/^\/([^\s]+)\s?(.+)?/);
        let args = [];
        let command;
        if (match !== null) {
            if (match[1]) {
                command = match[1];
            }
            if (match[2]) {
                args = match[2].split(' ');
            }
        }

        return args;
    }
    return [];
}

// Get the arguments of a command as a text
let GetCommandText = function(ctx) {
    const text = ctx.message.text.toLowerCase();
    if (text.startsWith('/')) {
        const match = text.match(/^\/([^\s]+)\s?(.+)?/);
        let args = [];
        let command;
        if (match !== null) {
            return match[2];
        }

        return args;
    }
    return '';
}

module.exports = {GetCommandArgs , GetCommandText}