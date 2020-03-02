
// Reigster server events
RegisterNetEvent('jsfour-computer:query');
RegisterNetEvent('jsfour-computer:emitNet');
RegisterNetEvent('jsfour-computer:tempData');
RegisterNetEvent('jsfour-computer:executeQuery');
RegisterNetEvent('jsfour-computer:queryAnswer');
RegisterNetEvent('jsfour-computer:esxStatus');

// Predefined SQL queries
const queries = {
    fetchNames: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `identifier`, `firstname`, `lastname` FROM `users`'
    },
    login: {
        sql: 'mysql_fetch_all',
        query: 'SELECT * FROM `jsfour_users` WHERE `username` = @username AND `password` = @password'
    },
    fetchIdByJob: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `identifier` FROM `users` WHERE `job` = @job'
    },
    fetchUsernames: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `username` FROM `jsfour_users`'
    },
    fetchID: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `id` FROM `jsfour_users` WHERE `username` = @username'
    },
    addUser: {
        sql: 'mysql_execute',
        query: 'INSERT INTO `jsfour_users` (`username`, `password`, `firstname`, `lastname`, `group`, `job`, `avatar`) VALUES (@username, @password, @firstname, @lastname, @group, @job, @avatar)'
    },
    deleteUser: {
        sql: 'mysql_execute',
        query: 'DELETE FROM `jsfour_users` WHERE `id` = @id'
    },
    updateUser: {
        sql: 'mysql_execute',
        query: 'UPDATE `jsfour_users` SET `username` = @username, `password` = @new, `firstname` = @firstname, `lastname` = @lastname, `group` = @group, `job` = @job, `avatar` = @avatar, `desktop` = @desktop WHERE `id` = @id and `password` = @password'
    },
    fetchUsersByJob: {
        sql: 'mysql_fetch_all',
        query: 'SELECT * FROM `jsfour_users` WHERE job = @job'
    },
    fetchAllUsers: {
        sql: 'mysql_fetch_all',
        query: 'SELECT * FROM `jsfour_users`'
    },
    addForumPost: {
        sql: 'mysql_execute',
        query: 'INSERT INTO `jsfour_forum` (`category`, `text`, `date`, `username`, `avatar`, `job`) VALUES (@category, @text, @date, @username, @avatar, @job)'
    },
    deleteForumPost: {
        sql: 'mysql_execute',
        query: 'DELETE FROM `jsfour_forum` WHERE `id` = @id'
    },
    fetchForumPosts: {
        sql: 'mysql_fetch_all',
        query: 'SELECT * FROM `jsfour_forum` WHERE job = @job'
    },
    updateForumAvatar: {
        sql: 'mysql_execute',
        query: 'UPDATE `jsfour_forum` SET `avatar` = @avatar WHERE `username` = @username'
    },
    medicalrecordsSearch: {
        sql: 'mysql_fetch_all',
        query: 'SELECT DISTINCT CONCAT(`firstname`, " ", `lastname`) as `name`, `dob`, COUNT(`dob`) as `count` FROM `jsfour_medicalrecords` WHERE `firstname` = @firstname OR `lastname` = @lastname OR `dob` = @dob GROUP BY `firstname`'
    },
    medicalrecordsAdd: {
        sql: 'mysql_execute',
        query: 'INSERT INTO `jsfour_medicalrecords` (`firstname`, `lastname`, `dob`, `text`, `title`, `date`, `uploader`) VALUES (@firstname, @lastname, @dob, @text, @title, @date, @uploader)'
    },
    medicalrecordsFetchAll: {
        sql: 'mysql_fetch_all',
        query: 'SELECT DISTINCT CONCAT(`firstname`, " ", `lastname`) as `name`, `dob`, COUNT(`dob`) as `count` FROM `jsfour_medicalrecords` GROUP BY `firstname` LIMIT 12'
    },
    medicalrecordsFetchUser: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `id`, `text`, `date`, `uploader`, `title` FROM `jsfour_medicalrecords` WHERE `firstname` = @firstname AND `lastname` = @lastname AND `dob` = @dob ORDER BY `id` DESC'
    },
    medicalrecordsDelete: {
        sql: 'mysql_execute',
        query: 'DELETE FROM `jsfour_medicalrecords` WHERE `id` = @id'
    },
    fetchAllJobAds: {
        sql: 'mysql_fetch_all',
        query: 'SELECT * FROM `jsfour_jobs`'
    },
    addJobAd: {
        sql: 'mysql_execute',
        query: 'INSERT INTO `jsfour_jobs` (`group`, `name`, `text`, `title`, `image`) VALUES (@group, @name, @text, @title, @image)'
    },
    updateJobAd: {
        sql: 'mysql_execute',
        query: 'UPDATE `jsfour_jobs` SET `name` = @name, `group` = @group, `image` = @image, `text` = @text, `title` = @title WHERE `id` = @id'
    },
    deleteJobAd: {
        sql: 'mysql_execute',
        query: 'DELETE FROM `jsfour_jobs` WHERE `id` = @id'
    },
    sendMail: {
        sql: 'mysql_execute',
        query: 'INSERT INTO `jsfour_mail` (`from`, `to`, `text`, `date`, `avatar`, `name`, `title`, `read`) VALUES (@from, @to, @text, @date, @avatar, @name, @title, @read)'
    },
    fetchUserEmails: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `avatar` as `email` FROM `jsfour_mail` WHERE `folder` = "registry" AND `name` = @id'
    },
    fetchEmail: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `avatar` as `email` FROM `jsfour_mail` WHERE `folder` = "registry" AND `avatar` = @email'
    },
    fetchMail: {
        sql: 'mysql_fetch_all',
        query: 'SELECT * FROM `jsfour_mail` WHERE `from` = @email OR `to` = @email'
    },
    updateMailRead: {
        sql: 'mysql_execute',
        query: 'UPDATE `jsfour_mail` SET `read` = 1 WHERE `id` = @id'
    },
    updateMailFolder: {
        sql: 'mysql_execute',
        query: 'UPDATE `jsfour_mail` SET `folder` = @folder WHERE `id` = @id'
    },
    updateEmail: {
        sql: 'mysql_execute',
        query: 'UPDATE `jsfour_mail` SET `avatar` = @email WHERE `name` = @id AND `avatar` = @oldemail'
    },
    deleteMail: {
        sql: 'mysql_execute',
        query: 'DELETE FROM `jsfour_mail` WHERE `id` = @id'
    },
    deleteEmail: {
        sql: 'mysql_execute',
        query: 'DELETE FROM `jsfour_mail` WHERE `avatar` = @email AND `name` = @id'
    },
    registerMail: {
        sql: 'mysql_execute',
        query: 'INSERT INTO `jsfour_mail` (`avatar`, `folder`, `name`) VALUES (@email, @folder, @id)'
    },
    getJobs: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `name` FROM `jobs`'
    },
    fetchUserVehicles: {
        sql: 'mysql_fetch_all',
        query: 'SELECT * FROM `owned_vehicles` WHERE `owner` = @identifier'
    },
    getSocieties: {
        sql: 'mysql_fetch_all',
        query: 'SELECT `account_name` AS `name` FROM `addon_account_data` WHERE `account_name` LIKE "society_%"'
    },
    updateUserIconSlots: {
        sql: 'mysql_execute',
        query: 'UPDATE `jsfour_users` SET `iconslots` = @iconslots WHERE `username` = @username AND `password` = @password'
    },
}

// Temp data, removed on server restart
let tempData = {
    storage: {},
    add: function ( data ) { // Add data to the storage object
        let program = data.data.program;
        delete data.data.program; // Remove the program since it won't be needed

        // Checks if the object already has the program
        if ( this.storage[program] ) { 
            this.storage[program][this.storage[program].length++] = JSON.stringify( data.data );
        } else {
            this.storage[program] = [];
            this.storage[program][0] = JSON.stringify( data.data );
        }
    },
    delete: function ( key, index ) {
        delete this.storage[key].splice(index, 1);
    },
    get: function ( key ) {
        return this.storage[key];
    }
}

// Function that checks if es_extended is started
function HasESX() {
    let started = true;

    if ( GetResourceState('es_extended') != 'started' ) {
        started = false;
    }

    return started;
}

// Execute SQL query
async function executeQuery( sql, query, params ) {
    return new Promise( ( resolve, reject ) => {
        exports['mysql-async'][sql](query, params, ( result, err ) => {
            if ( err )
                return reject( err );
           
            return resolve( result );
        });
    });
}

// Check if value exists. (Only checks if it's an insert or update query. Fetch also needs to have the @uniqueValue param)
async function valueExist( type, params ) {
    let table = queries[type].query.split(' ');

    if ( table[0] === 'INSERT' ) {
        table = table[2];
    } else if ( table[0] === 'UPDATE' ) {
        table = table[1];
    }
 
    if ( Object.keys( params ).length > 0 ) {
        let result = await executeQuery( 'mysql_fetch_all', `SELECT * FROM ${ table } WHERE ${ params['@uniqueValue'].substr(1) } = @unique`, { unique: params[params['@uniqueValue']] } );

        return result.length;
    } else {
        return 0;
    }
}

// Execute query
onNet('jsfour-computer:executeQuery', ( data ) => {
    executeQuery(queries[data.type].sql, queries[data.type].query, data.data);
});

// Get the ESX status in a callback
onNet('jsfour-computer:esxStatus', () => {
    emitNet('jsfour-computer:esxStatus', source, HasESX());
});

// Run a SQL query
onNet('jsfour-computer:query', async ( data ) => {
    // Set the source to a variable since it seems to break when using source further down?
    let _source = source;

    // Checks if it's an insert or update query
    if ( queries[data.type].query.includes('INSERT') || queries[data.type].query.includes('UPDATE') ) {
        // Checks if the request params has a @uniqueValue set
        if ( '@uniqueValue' in data.data ) {
            // If it's set it will check if the value exist before inserting it, might be useful
            if ( !await valueExist( data.type, data.data ) ) {
                // No values found, insert/update it and return true
                executeQuery( queries[data.type].sql, queries[data.type].query, data.data );
                emitNet('jsfour-computer:callback', _source, true, data.CallbackID);
            }
        } else {
            // No @unqueValue, just insert/update it withouth checking and return true
            executeQuery( queries[data.type].sql, queries[data.type].query, data.data );
            emitNet('jsfour-computer:callback', _source, true, data.CallbackID);
        }
    } else {
        // Not an insert/update query. Probably a select or a delete query
        let result = await executeQuery( queries[data.type].sql, queries[data.type].query, data.data );

        // Return the result
        emitNet('jsfour-computer:callback', _source, result, data.CallbackID);
    }

    emitNet('jsfour-computer:callback', _source, false, data.CallbackID);
});

// Send data to all clients or everyone who has a specified ESX job
onNet('jsfour-computer:emitNet', async ( data ) => {
    // Checks if you want to send data to every client or a specific job
    if ( data.type != 'all'  ) {
        // To be able to send data to a speciifc job you need to have ESX installed
        if ( HasESX() ) {
            // Fetches all the identifiers with the specified job
            let result = await executeQuery( queries['fetchIdByJob'].sql, queries['fetchIdByJob'].query, { '@job' : data.job } );

            // Checks if it finds any users with that job in the database
            if ( result.length > 0 ) {
                let identifiers = {};

                // Get all identifiers of all users who's online
                for (let i = 1; i < GetNumPlayerIndices() + 1; i++) {
                    identifiers[GetPlayerIdentifier(i)] = i;
                }

                // Loop through every identifier
                for (let i = 0; i < result.length; i++) {
                    // Check if the identifier matches an identifier from the database who has that job
                    if( identifiers.hasOwnProperty(result[i].identifier) ) {
                        // emitNet to the specified client
                        emitNet('jsfour-computer:toNUI', identifiers[result[i].identifier], data.data);
                    }
                } 
            }
        } else {
            // ESX isn't installed
            console.error(`[jsfour-computer] YOU CAN'T USE emitNet/${ job } SINCE YOU DON'T HAVE ESX INSTALLED.`);
            emitNet('jsfour-computer:error', -1, `YOU CAN'T USE emitNet/${ job } SINCE YOU DON'T HAVE ESX INSTALLED.`);
        }
    } else {
        // Sends data to every client on the server
        emitNet('jsfour-computer:toNUI', -1, data.data);
    }

    if ( data.tempdata ) { tempData.add(data); }
});

// Client call, modify or get tempdata
onNet('jsfour-computer:tempData', ( data ) => {
    let _source = source;

    switch( data.type ) {
        case 'add':
            break;
        case 'delete':
            break;
        case 'get':
            emitNet('jsfour-computer:tempData', _source, tempData.get(data.program));
            break;
    }
});