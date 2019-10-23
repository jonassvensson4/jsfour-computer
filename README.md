# [BETA] jsfour-computer BUG TESTING
## This resource is not finished and may contain bugs. Please don't use it if you don't know how to debug a script.



A usable computer and tablet in-game. You can easily add your own programs by following the guide down below. To be able to do this you need to have some knowledge in html, javascript and css. **I will not** help you add programs.

There are a couple of small built-in programs to show examples of what you can do:
* Medical records
* A basic forum for the players current job
* Admin panel to add/delete/modify users
* Twitter:
	* A really basic replica of Twitter that lets you tweet.
* Car dealer:
	* Shows pictures of vehicles, vehicles can be blacklisted in the programs javascript
* Employees
    * Boss actions for the logged in users job. Only available if you have ESX installed.
* Job center
    * Shows available jobs.
* Command prompt
* Calcylator
* Folders
* Mail

A more indepth guide of each program can be found <a href="" target="_blank">here</a>.

Due to the lack of time I can't add any more programs. I have however created a <a href="https://github.com/jonassvensson4/jsfour-computer/issues/1" target="_blank">list</a> of the programs that I wanted to add to give you some  ideas. These programs may be added in another update.

### LICENSE
Please don't sell or reupload this resource. 
Feel free to make forks and post any updates in the original forum thread. **Do not** create your own thread since it's not a new release.

### PREVIEW
[![jsfour-computer preview](https://img.youtube.com/vi/SpRQO5UtZSA/0.jpg)](https://www.youtube.com/watch?v=SpRQO5UtZSA)

### INSTALLATION
* Install dependency: <a href="https://github.com/jonassvensson4/jsfour-core">jsfour-core</a>
* <a href="https://github.com/jonassvensson4/jsfour-computer/releases">Download the resource</a>
* Add `start jsfour-computer` to your server.cfg. Remember to start it after my jsfour-core resource.
* Run the SQL file.

##### INFO
* The SQL file will create an admin user, the username and the password is set to `admin`. It's recommended to change this in the user settings inside the computer..
* The passwords are **not** encrypted, please tell your users to use a simple password, their name or something in case of a leak.
* Yes I'm bad at designing stuff, shut uuuup.

### ADD PROGRAMS
I **won't** provide any personal support regarding adding more programs. Feel free to create a pull request if you want to share a program with others.

There are currently 4 groups added; `admin, user, all, null`. Null means you don't have to login to be able to use the program. Examples can be found in the programConfig.js file.

##### PROGRAMCONFIG.JS
```javascript
'programName': { // the name needs to be the same as the html file you added in the programs folder
    'title': 'Employees', // Title of the program that will be displayed in the top left corner of the program.
    'icons': {
        start: true, // Adds a start icon if set to true
        desktop: false, // Adds a desktop icon if set to true
        taskbar: true // Adds a taskbar icon if set to true
    },
    'options': {
        allowMinimize: true, // Allowed to minimize the program if set to true
        allowResize: true, // Allowed to resize the program if set to true (toggle fullscreen)
        allowRefresh: true // Allowed to refresh the program if set to true (calls the programs refresh functon refreshprogramName() if you've created it in the programs js file)
    },
    'access': {
        group: 'all', // A string of allowed group, set to 'all' to allow all groups. If set to 'null' it won't read the job down below since null means that the user doesn't have to log in
        job: ['police', 'ambulance'] // An array of allowed jobs, set to ['all'] to allow all jobs
    },
    'onStart': { // If onStart doesn't exist it will start the program in fullscreen
        fullscreen: true, // Starts the program in fullscreen if set to true
        width: '100px', // Sets the programs width, will only work if fullscreen is set to false 
        height: '100px', // Sets the programs height, will only work if fullscreen is set to false
        top: '100px', // Sets the programs start location (offset from top), can't be combined with bottom
        bottom: '100px', // Sets the programs start location (offset from bottom), can't be combined with top
        right: '100px', // Sets the programs start location (offset from right), can't be combined with left
        left: '100px', // Sets the programs start location (offset from left), can't be combined with right
        iconDroppable: true // Makes the program icon droppable, it will accept other program icons 
    },
    'ESX': true, // If set to true this program requires ESX. If you don't have it installed you won't see this program. Added this to be able to make the script standalone. You won't need this in your program
    'tablet': true // Makes the program accessable on the tablet if set to true. It generates 2 copies of the html file so remember to use class instead of id on elements
}
```

##### HOW TO
1. Create a folder inside the <a href="https://github.com/jonassvensson4/jsfour-computer/html/programs" target="_blank">html/programs</a> folder without any spaces. (There's a template folder that you can use as a base). 
2. Create a html file inside the folder with the exact same name as the folder. You can currently add files with any of the following extension (.html, .js, .css, .png, .jpg, .gif, .json) in the folder. If you want to include other files this needs to be added in the __resource.lua
3. Add the program to the <a href="https://github.com/jonassvensson4/jsfour-computer/html/programs/programConfig.js" target="_blank">programConfig.js</a> file. The name needs to be the exact same as the folder you've just created.
4. Icons can be added to the icons.png file. PSD file can be found <a href="https://www.dropbox.com/s/c4uwn17hfixny16/icons.psd?dl=0" target="_blank">here</a>.
5. If your program requires data from the database you'll need to specify the SQL query in the <a href="https://github.com/jonassvensson4/jsfour-computer/server.js" target="_blank">server.js</a>. It will then be available when using fetch(). Examples of the fetch function can be found in different programs and in the <a href="https://github.com/jonassvensson4/jsfour-core/" target="_blank">jsfour-core</a> readme.

