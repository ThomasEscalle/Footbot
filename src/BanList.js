// Import the file system module
const fs = require('fs');


// Create the class
let BanList = class {

    constructor() {
        // Create the default values
        this.ban_list = [];
    }

    // Load the ban list from a file.
    // The file is located in data/ban_list.json
    // Return a boolean to say if there was an error or not.
    Load() {
        let error = false;
        let content = fs.readFileSync('data/ban_list.json', 'utf8');

        // parse JSON string to JSON object
        const data = JSON.parse(content);

        // Apply the data
        this.ban_list = data.ban_list;


        // Return  if there was an error or not
        return error;
    }

    // Save the current state of the ban list to file.
    // This is saved in data/ban_list.json
    // Return a boolean to say if there was an error or not.
    Save() {
        var saved_data = {
            "ban_list": this.ban_list
        }
        var jsonContent = JSON.stringify(saved_data);

        let error = false;

        // Write into the file
        fs.writeFileSync("data/ban_list.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                error = true;
                return console.log(err);
            }

            error = false;
        });

        return error;
    }

    // Check if a user is in the ban list.
    // Return true if the user is in the list, false otherwise.
    IsUserInList(user) {
        let is_in_list = false;

        // Check if the user is in the list
        for (let i = 0; i < this.ban_list.length; i++) {
            if (this.ban_list[i].identifier == user.identifier) {
                is_in_list = true;
                break;
            }
        }

        return is_in_list;
    }


    // Add the user to the ban list
    AddUser(user) {
        // Check if the user is in the ban list
        if (this.IsUserInList(user)) {
            return;
        }

        // Add the user to the list
        this.ban_list.push(user);
    }

    // Remove a user from the ban list
    RemoveUser(user) {
        // Remove the user from the list
        for (let i = 0; i < this.ban_list.length; i++) {
            if (this.ban_list[i].identifier == user.identifier) {
                this.ban_list.splice(i, 1);
                break;
            }
        }
    }

}

// export the class
module.exports = BanList;