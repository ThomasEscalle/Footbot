const fs = require('fs');


function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(pdate) {
    return [
        padTo2Digits(pdate.getDate()),
        padTo2Digits(pdate.getMonth() + 1),
        pdate.getFullYear()
    ].join('/');
}



// The class that stores the informations for the next event
let NextEventInformation = class
{

    // Constructor of the class.
    constructor() {
        // Set some default values
        this.max_users = 28;
        this.date = new Date();
        this.location = '';
        this.duration = '2 hours'

        // Load the data 
        this.Load();
    }


    // Save the informations about the next event in file
    // This file is located in data/next_event_informations.json
    // Return a boolean to say if there was an error or not.
    Save()  {
        var saved_data = {
            "max_users" : this.max_users,
            "date" : this.date,
            "location" : this.location,
            "duration" : this.duration
        }
        var jsonContent = JSON.stringify(saved_data);

        let error = false;

        // Write into the file
        fs.writeFileSync("data/next_event_informations.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                error = true;
                return console.log(err);
            }
         
            error = false;
        });

        return error;
    }

    // Load the informations about the next event in the file
    // This file is located in data/next_event_informations.json
    Load() {
        let error = false;
        let content = fs.readFileSync('data/next_event_informations.json', 'utf8');

        // parse JSON string to JSON object
        const data = JSON.parse(content);

        // Apply the data 
        this.max_users = data.max_users;
        this.date = new Date(data.date);
        this.location = data.location;
        this.duration = data.duration;

        // Return  if there was an error or not
        return error;
    }

    // Parse the date for the next event
    // this must be format 
    //<year>-<mounth>-<day> <hour>:<minutes>
    // -> Example :  ParseDate("2022-05-22 17:50")
    ParseDate( str_date ) {
        // Try to parse the date as a new date
        var parsed = new Date(str_date);
        
        // Test if the date is valid
        if(parsed instanceof Date && !isNaN(parsed.valueOf())) {
            this.date = parsed;
            return true;
        }
        else {
            console.log("An error occured when parsing the date : " + str_date);
            return false;
        }
    }

    ToString() {
        let str = '';
        str += 'Date: ' + DateToString()  + '\n';
        str += 'Duration: ' + this.duration + '\n';
        str += 'Maximum number of participants: ' + this.max_users +'\n';
        str += 'Location: ' + this.location + '\n';
        return str;
    }

    DateToString() {
        return formatDate(this.date) + ' ' + this.date.getHours().toString() + ':' + this.date.getMinutes().toString();
    }


}

// Export the class
module.exports = NextEventInformation;


