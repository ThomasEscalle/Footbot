const fs = require('fs');
// Import the DefaultUser class
const DefaultUsers = require('./DefaultUsers');


// The class that represent the list of users
// registered and in the waiting list.
let RegisteredUsers = class 
{

    constructor () {
        // Create default values
        this.registered_users = [];
        this.waiting_list = [];
    }

    // Save the current state of the registered users to file.
    // This is saved in data/registered_users.json
    // Return a boolean to say if there was an error or not.
    Save() {
        var saved_data = {
            "registered_users" : this.registered_users,
            "waiting_list" : this.waiting_list
        }
        var jsonContent = JSON.stringify(saved_data);

        let error = false;

        // Write into the file
        fs.writeFileSync("data/registered_users.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                error = true;
                return console.log(err);
            }
         
            error = false;
        });

        return error;
    }


    // Load the state from a file.
    // The loaded file is data/registered_users.json
    // Return a boolean to say if there was an error or not.
    Load() {
        let error = false;
        let content = fs.readFileSync('data/registered_users.json', 'utf8');

        // parse JSON string to JSON object
        const data = JSON.parse(content);

        // Apply the data 
        this.registered_users = data.registered_users;
        this.waiting_list = data.waiting_list;


        // Return  if there was an error or not
        return error;
    }



    // Refresh the list of users, 
    // if there are free spots, put the people from the waiting list to the participants
    Refresh(NumberOfParticipants) {
        // Check if the list of registered users is full
        if (this.IsRegisteredUsersFull(NumberOfParticipants)) {
            return;
        }

        // Check if there are people in the waiting list
        if (this.waiting_list.length > 0) {
            // Loop while the registered users are not full
            while (!this.IsRegisteredUsersFull(NumberOfParticipants)) {
                // check if there is a person in the waiting list
                if (this.waiting_list.length > 0) {                
                    // Get the first person in the waiting list
                    let user = this.waiting_list.shift();
    
                    // Add the user to the registered users
                    this.registered_users.push(user);
                }
            }
        }

        // Check if there are too many people in the registered users
        if (this.registered_users.length > NumberOfParticipants) {
            // Loop while the registered number of users is greater than the number of participants
            while (this.registered_users.length > NumberOfParticipants) {
                // Get the last person in the registered users
                let user = this.registered_users.pop();
                // Add the user to the waiting list
                this.waiting_list.push(user);
            }
        }
    }



    // Add a user to the list of users (participant list, and waiting list if the list is full)
    AddUser(user, max_participants) {
        // Check if the participant list is full
        if (this.registered_users.length >= max_participants) 
        {
            // Add the user to the waiting list
            this.waiting_list.push(user);
        } 
        else 
        {
            // Add the user to the participant list
            this.registered_users.push(user);
        }
    }



    // Remove a user from the list of users (waiting list and participant list)
    RemoveUser(user) { 
        let return_value = "";

        // Loop through the list of users and remove the user
        for (let i = 0; i < this.waiting_list.length; i++) {
            if (this.waiting_list[i].identifier == user.identifier) {
                this.waiting_list.splice(i, 1);
                return_value = "waiting_list"
                break;
            }
        }

        // Loop throught the list of registered users and remove the user
        // Only if the user is not a friend
        for(let i = 0; i < this.registered_users.length; i++) {
            if (this.registered_users[i].identifier == user.identifier) {
                this.registered_users.splice(i, 1);
                return_value = "registered_users"
                break;
            }
        }

        return return_value;
    }

    // Remove a user friend of the list of users (waiting list and participant list)
    RemoveUserFriend(user) {
        let return_value = "";

        // Loop throught the list of registered users and remove the user
        for(let i = 0; i < this.registered_users.length; i++) {
            if (this.registered_users[i].identifier == user.identifier && user.friend_name == this.registered_users[i].friend_name) {
                this.registered_users.splice(i, 1);
                return_value = "registered_users"
                break;
            }
        }

        // Loop through the list of users in the waiting list and remove the user
        for (let i = 0; i < this.waiting_list.length; i++) {
            if (this.waiting_list[i].identifier == user.identifier && user.friend_name == this.waiting_list[i].friend_name) {
                this.waiting_list.splice(i, 1);
                return_value = "waiting_list"
                break;
            }
        }
        
        return return_value;
    }


    // Check if the user is in the waiting list
    IsUserInWaitingList(user) {
        for (let i = 0; i < this.waiting_list.length; i++) {
            if (this.waiting_list[i].identifier == user.identifier) {
                return true;
            }
        }
        return false;
    }

    // Check if the user is in the registered list
    IsUserInRegisteredList(user) {
        for (let i = 0; i < this.registered_users.length; i++) {
            if (this.registered_users[i].identifier == user.identifier) {
                return true;
            }
        }
        return false;
    }

    // check if the user is in the list of users (waiting list and participant list)
    IsUserInList(user) {
        if (this.IsUserInWaitingList(user) || this.IsUserInRegisteredList(user)) {
            return true;
        }
        return false;
    }

    // Check if the list of registered users is full
    IsRegisteredUsersFull(max_participants) {
        if (this.registered_users.length >= max_participants) {
            return true;
        }
        return false;
    }


    // Remove all the users with their identifier from the list of users (waiting list and participant list)
    RemoveAllUsersWithIdentifier(identifier) {
        for (let i = 0; i < this.waiting_list.length; i++) {
            if (this.waiting_list[i].identifier == identifier) {
                this.waiting_list.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < this.registered_users.length; i++) {
            if (this.registered_users[i].identifier == identifier) {
                this.registered_users.splice(i, 1);
                i--;
            }
        }
    }

    // Remove all the friends of a user with their identifier from the list of users (waiting list and participant list)
    RemoveAllFriendsWithIdentifier(identifier) {
        for (let i = 0; i < this.waiting_list.length; i++) {
            if (this.waiting_list[i].identifier == identifier && this.waiting_list[i].is_friend == true) {
                this.waiting_list.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < this.registered_users.length; i++) {
            if (this.registered_users[i].identifier == identifier && this.waiting_list[i].is_friend == true) {
                this.registered_users.splice(i, 1);
                i--;
            }
        }
    }



    // Completely reset the list of users to the default user list
    ResetList(NumberOfParticipants) {
        // Create a DefaultUser object
        let default_user = new DefaultUsers(); 
        // Load the data from file
        default_user.Load();

        // Apply the registered user list to the list of users
        this.registered_users = default_user.registered_users;
        // Clear the waiting list
        this.waiting_list = [];

        // Refresh in case there are to many people in the list
        this.Refresh(NumberOfParticipants);
    }

}

module.exports = RegisteredUsers;
