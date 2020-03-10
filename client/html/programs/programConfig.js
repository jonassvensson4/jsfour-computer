const programs = {
    'account': {
        'title': 'Account', // Title in the left corner of the program 
        'icons': { // Icon options
            start: true, // Start menu icon
            desktop: false, // Desktop icon
            taskbar: true // Taskbar icon
        },
        'options': { // Program window options
            allowMinimize: true, // Minimze window
            allowResize: true, // Toggle fullscreen
            allowRefresh: false // Enables the refresh function, calls the programs refresh function: refreshprogram() where the program is the name, in this case refreshaccount()
        },
        'access': { // Allowed jobs and group.
            group: 'all', // Allowed group. admin, user, all, null
            job: ['all'] // Allowed job, if set to 'all' every job will see it
        },
        'onStart': { // When the program loads in this will run..
            fullscreen: true // Only currently used to start the program in fullscreen or not
        },
        'tablet': false // Allows the program to be accessed through the tablet if set to true
    },              
    'groups': {
        'title': 'Groups',
        'icons': {
            start: true
        },
        'options': {
            allowMinimize: true,
            allowResize: true,
            allowRefresh: true
        },
        'access': {
            group: 'admin',
            job: ['all']
        },
        'onStart': {
            fullscreen: true
        }
    },
    'medicalrecords': {
        'title': 'Medical Records',
        'icons': {
            desktop: true
        },
        'options': {
            allowResize: true,
            allowMinimize: true,
            allowRefresh: true
        },
        'access': {
            group: 'all',
            job: ['ambulance']
        },
        'onStart': {
            fullscreen: true
        },
        'tablet': true
    },
    'cardealer': {
        'title': 'Car dealer',
        'icons': {
            desktop: true
        },
        'options': {
            allowMinimize: true
        },
        'access': {
            group: 'null',
            job: ['all']
        },
        'onStart': {
            fullscreen: true
        }
    },
    'forum': {
        'title': 'Forum',
        'icons': {
            desktop: true
        },
        'options': {
            allowMinimize: true,
            allowRefresh: true,
            allowResize: true
        },
        'access': {
            group: 'all',
            job: ['police', 'ambulance']
        },
        'onStart': {
            fullscreen: true
        }
    },
    'twitter': {
        'title': 'Twitter',
        'icons': {
            desktop: true
        },
        'options': {
            allowMinimize: true,
            allowResize: true
        },
        'access': {
            group: 'all',
            job: ['all']
        },
        'onStart': {
            fullscreen: true
        }
    },
    'bossactions': {
        'title': 'Employees',
        'icons': {
            desktop: true
        },
        'options': {
            allowMinimize: true,
            allowResize: true,
            allowRefresh: true
        },
        'access': {
            group: 'admin',
            job: ['all']
        },
        'onStart': {
            fullscreen: true
        },
        'ESX': true
    },
    'calcylator': {
        'title': 'Calcylator',
        'options': {
            allowMinimize: true
        },
        'icons': {
            start: true
        },
        'access': {
            group: 'all',
            job: ['all']
        },
        'onStart': {
            width: '180px',
            height: '295px'
        }
    },
    'jobcenter': {
        'title': 'Job Center',
        'options': {
            allowMinimize: true,
            allowResize: true,
            allowRefresh: true
        },
        'icons': {
            desktop: true
        },
        'access': {
            group: 'all',
            job: ['all']
        },
        'onStart': {
           fullscreen: true
        }
    },
    'terminal': {
        'title': 'Terminal',
        'options': {
            allowMinimize: true
        },
        'icons': {
            start: true
        },
        'access': {
            group: 'all',
            job: ['all']
        },
        'onStart': {
            width: '500px',
            height: '300px'
        }
    },
    'folder': {
        'title': 'Folder',
        'options': {
            allowMinimize: true,
            allowResize: true
        },
        'icons': {
            desktop: true
        },
        'access': {
            group: 'all',
            job: ['all']
        },
        'onStart': {
            width: '600px',
            height: '350px',
            iconDroppable: true
        }
    },
    'mail': {
        'title': 'Mail',
        'options': {
            allowMinimize: true,
            allowResize: true,
            allowRefresh: true
        },
        'icons': {
            start: true
        },
        'access': {
            group: 'all',
            job: ['all']
        },
        'onStart': {
            fullscreen: false
        }
    },
    'controlpanel': {
        'title': 'Control Panel',
        'icons': {
            start: true
        },
        'options': {
            allowMinimize: true,
            allowResize: true
        },
        'access': {
            group: 'all',
            job: ['all']
        },
        'onStart': {
            fullscreen: false
        }
    },
    'settings': {
        'title': 'Settings',
        'options': {
            allowMinimize: true
        },
        'access': {
            group: 'all',
            job: ['all']
        },
        'onStart': {
            fullscreen: false,
            width: '610px',
            height: '450px',
            top: '50px',
            right: '50px'
        }
    },
}