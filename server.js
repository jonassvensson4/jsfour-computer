// Since some people mess up their start order I added this
if ( GetResourceState( 'jsfour-core' ) != 'started' ) {
    console.error(`[jsfour-computer] DEPENDENCY jsfour-core NOT STARTED! FIX YOUR START ORDER/INSTALL DEPENDENCY`);
}

// Add SQL queries to the jsfour-core resource
emit('jsfour-core:addQuery', {
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
});