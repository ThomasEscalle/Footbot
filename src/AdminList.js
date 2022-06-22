const fs = require('fs');


/// The class that manage the list of administrators of the application
let AdminList = class 
{

    // Construct the class
    constructor() {
        this.admin_list = [];

        // Load the data by default
        this.Load();
    }


    // Save the list of administrators to the file system.
    // The file is saved in  data/admin_list.json
    // Return if the data was succesfully saved or if there was an error
    Save() 
    {
        var saved_data = {
            "admin_list" : this.admin_list,
        }
        var jsonContent = JSON.stringify(saved_data);

        let error = false;

        // Write into the file
        fs.writeFileSync("data/admin_list.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                error = true;
                return console.log(err);
            }
         
            error = false;
        });

        return error;
    }

    // Load the list of admins from a file
    // The file path is : data/admin_list.json
    // Return if the file was succesfully loaded
    Load() 
    {
        let error = false;
        let content = fs.readFileSync('data/admin_list.json', 'utf8');

        // parse JSON string to JSON object
        const data = JSON.parse(content);

        // Apply the data 
        this.admin_list = data.admin_list;


        // Return  if there was an error or not
        return error;
    }



    /// Check if the user is an admin or not
    IsAdmin(user_identifier) {
        // Loop through all the admins.
        for (let i=0; i < this.admin_list.length ; i++) {
            let value = this.admin_list[i];
            if(value.identifier === user_identifier) return true;
        }
        return false;
    }


    /// Return the list of administrators as a nice string
    ToString() 
    {
        let str = '';

        // Loop through all the admins.
        for (let i=0; i < this.admin_list.length ; i++) {
            let value = this.admin_list[i];

            str += '<b>' + value.display_name + '</b> (@' +  value.identifier +  ')\n';
            str += 'Role : <i>' + value.admin_role + '</i>\n\n';
        }

        return str;
    }


    Debug(ctx) {
        ctx.reply(JSON.stringify(this.admin_list));
    }

}


module.exports = AdminList;