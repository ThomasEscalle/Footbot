const fs = require('fs');


// The class that manage the users that are by default in the list
let DefaultUsers = class 
{

    constructor() {
        // Create the default values
        this.user_list = [];
    }


    // Load the default users from a file.
    // The file is located in data/default_users.json
    // Return a boolean to say if there was an error or not.
    Load() {
        let error = false;
        let content = fs.readFileSync('data/default_users.json', 'utf8');

        // parse JSON string to JSON object
        const data = JSON.parse(content);

        // Apply the data
        this.user_list = data.user_list;


        // Return  if there was an error or not
        return error;
    }

    // Save the current state of the default users to file.
    // This is saved in data/default_users.json
    // Return a boolean to say if there was an error or not.
    Save() {
        var saved_data = {
            "user_list" : this.user_list
        }
        var jsonContent = JSON.stringify(saved_data);

        let error = false;

        // Write into the file
        fs.writeFileSync("data/default_users.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                error = true;
                return console.log(err);
            }
         
            error = false;
        });

        return error;
    }


    // Check if a user is in the default users list.
    // Return true if the user is in the list, false otherwise.
    IsUserInList(user) {
        for (let i = 0; i < this.user_list.length; i++) {
            if (this.user_list[i].identifier == user.identifier) {
                return true;
            }
        }
        return false;
    }

    // Add a user to the default users list.
    AddUser(user) {
        this.user_list.push(user);
        // Save the data
        this.Save();
    }

    // Remove the duplicated users from the list of default users
    RemoveDuplicatedUsers() {
        let new_user_list = [];
        for (let i = 0; i < this.user_list.length; i++) {
            let user = this.user_list[i];
            if (!this.IsUserInList(user)) {
                new_user_list.push(user);
            }
        }
        this.user_list = new_user_list;
        // Save the data
        this.Save();
    }

    // Remove a user from the list of default users
    RemoveUser(user) {
        for (let i = 0; i < this.user_list.length; i++) {
            if (this.user_list[i].identifier == user.identifier) {
                this.user_list.splice(i, 1);
                // Save the data
                this.Save();
                return true;
            }
        }
        return false;
    }
}

// Export the class
module.exports = DefaultUsers;

