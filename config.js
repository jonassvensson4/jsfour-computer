// Button to open the computer, controls can be found at the FiveM docs.
const key = 38;

// Display the markers?
const displayMarkers = true;

// Locations of the computers, more locations can be added.
// To add more backgrounds simply place your image in the html/asset/images folder. 
// You don't have to add it to the __resource.lua, it reads all .gif, .jpg and .png files.
const locations = {
    'hospital': {
        coords: { x: -61.942230224609, y: -1118.2244873047, z: 26.435796737671 }, // Coords of the marker
        marker: {
            drawDistance: 5, // Player distance before the marker is visible
            type: 27, // Marker type
            size: { x: 2.0, y: 2.0, z: 1.0 }, // Marker size
            color: { r: 26, g: 55, b: 186 }, // Marker color
            text: 'Press ~E~' // Marker text/hint
        },
        loginLogo: 'assets/images/logo_hospital.png', // Computer login logo image path
        loginBackground: 'assets/images/login_hospital.png', // Computer login background image path
        desktopBackground: 'assets/images/windows.png', // Computer desktop background image path
        login: true, // Required to login? (Useful if you just want to display something in a store etc.. without asking the user to login)
        run: false // You can specify a program to run on start, see the cardealer marker down below
    },
    'policestation': {
        coords: { x: 1, y: 1, z: 1 },
        marker: {
            drawDistance: 5,
            type: 27,
            size: { x: 2.0, y: 2.0, z: 1.0 },
            color: { r: 26, g: 55, b: 186 },
            text: 'Press ~E~'
        },
        loginLogo: 'assets/images/logo_hospital.png',
        loginBackground: 'assets/images/login_hospital.png',
        desktopBackground: 'assets/images/windows.png',
        login: true,
        run: false
    },
    'cardealer': {
        coords: { x: -56.209499359131, y: -1096.6896972656, z: 25.422355651855 },
        marker: {
            drawDistance: 5,
            type: 27,
            size: { x: 2.0, y: 2.0, z: 1.0 },
            color: { r: 26, g: 55, b: 186 },
            text: 'Press ~E~'
        },
        loginLogo: 'assets/images/logo_hospital.png',
        loginBackground: 'assets/images/login_cardealer.png',
        desktopBackground: 'assets/images/login_cardealer.png',
        login: false,
        run: 'cardealer'
    },
}

// A command that lets a player open the computer, disabled by default. 
// # disableDistance;
// # if set to true the player can open the computer everywhere. If set to false the player needs to be standing next to one of the positions above ^
const command = {
    enable: true, // Command enabled?
    disableDistance: true,
    name: 'computer' // Name of the command /computer location
}
