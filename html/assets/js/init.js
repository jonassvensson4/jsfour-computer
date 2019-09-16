let sessionToken;
let endpoint;
let loggedInUser;
let volume = 0.5;
let markerLocation = 'none';
let loadedPrograms = [];
let esxEnabled = false;
let calendarOpen = false;
let calendarInterval;
let computerStatus = true;
let steam = null;

// Sets the default volumne to 0.2
Howler.volume(volume);

let sound_signin = new Howl({
    src: ['assets/sounds/signin.ogg'],
    volume: volume
});

let sound_signout = new Howl({
    src: ['assets/sounds/signout.ogg'],
    volume: volume
});

let sound_turnoff = new Howl({
    src: ['assets/sounds/turnoff.ogg'],
    volume: volume
});

let sound_turnon = new Howl({
    src: ['assets/sounds/turnon.ogg'],
    volume: 1
});

let sound_notify = new Howl({
    src: ['assets/sounds/notify.ogg'],
    volume: volume
});

// Generates a random int
function getRandomInt(max, min) {
    return Math.floor(Math.random() * Math.floor(max) + min);
}

// Sign out user
function signout() {
    $('.small-border').removeClass('small-border');
    $('.small-active').removeClass('small-active');

    sound_signout.play();

    setTimeout(() => {
        loggedInUser = null;
        $('#computer-loading').fadeIn('fast');
    }, 100);
}

// Turn off computer
function off() {
    if ( computerStatus ) {
        computerStatus = false;

        sound_turnoff.play();

        setTimeout(() => {
            loggedInUser = null;
            $('#computer-loading').fadeIn(1000, () => {
                $('#computer-loading-content').fadeOut(1500);
            });
        }, 100);
    } else {
        computerStatus = true

        sound_turnon.play();
        
        setTimeout(() => {
            $('#computer-loading').fadeIn(250, () => {
                $('#computer-loading-content').fadeIn(500);
                $('#login-username').select();
            });
        }, 800);
    }
}

// Load the programs
function loadPrograms() {
    // Icon slot
    let slot = 0;
    let row = 0;
    let tslot = 0;
    let trow = 0;

    // Empty the programs and icons incease of a reload
    $('#programs').html('');
    $('#windows-start').html('');
    $('#icon-containers').html('');
    $('#taskbar-icons').html(``); 

    // Generates desktop icon slots
    for ( let j = 0; j < 8; j++ ) {
        for ( let i = 0; i < 17; i++ ) {
            $('#icon-containers').append( `<div class="icon-container ${ j }-${ i }"></div>` );
        }
    }

    // Generates tablet icon slots
    for ( let j = 0; j < 6; j++ ) {
        for ( let i = 0; i < 10; i++ ) {
            $('#tablet-icon-containers').append( `<div class="icon-container t${ j }-t${ i }"></div>` );
        }
    }

    // Makes the icon slots droppable
    $('body .icon-container').droppable({
        accept: '.icon',
        drop: function( event, ui ) {
            let item = $( this ).find( '.icon' );

            ui.draggable.css({
                'top': 0,
                'left': 0
            });

            if ( $( ui.draggable ).find('span').hasClass( `icon-${ $(ui.draggable).attr('program') }-small` ) ) {
                $( ui.draggable ).find('span').removeClass(`icon-${ $(ui.draggable).attr('program') }-small`);
                $( ui.draggable ).find('span').addClass(`icon-${ $(ui.draggable).attr('program') }`);
            }

            if ( !item.hasClass('ui-droppable') ) {
                if ( item.length === 0 ) {
                    ui.draggable.detach().appendTo( $( this ) );
                } else {
                    item.appendTo( $( '.icon-container' ).eq( ui.draggable.attr('slot') ) );
                    ui.draggable.detach().appendTo( $( this ) );
                }
            }
        }
    });

    // Loop through all programs in the programsConfig
    Object.keys(programs).forEach(( k ) => {
        let allowedJobs = programs[k].access.job;

        for (let i = 0; i < allowedJobs.length; i++) {
            // Checks if the user has the specified job in the config or if the job set to all
            if ( loggedInUser && ( loggedInUser.job === allowedJobs[i] || allowedJobs[i] === 'all' || loggedInUser.job === 'all' ) || allowedJobs[i] === 'all' || programs[k].access.group === 'null'  ) {
                // Checks if the user has the specified group or if the group is set to all or null
                if ( loggedInUser && ( loggedInUser.group === programs[k].access.group || programs[k].access.group === 'all' || loggedInUser.group === 'admin' ) || programs[k].access.group === 'null' ) { 
                    // Checks if the program already has been loaded in, mainly used to prevent duplciated programs for the admin
                    if ( !loadedPrograms.includes( k ) ) {
                       // Checks if the program requires ESX and if the server has it installed
                        if ( ( programs[k].ESX && esxEnabled ) || !programs[k].ESX ) {
                            loadedPrograms.push( k );

                            // Loads in the html file from the programs folder strucutred like this: programs/name/name.html
                            $.get(`programs/${k}/${k}.html`, function( data ) {
                                let content = `<div class="program-wrapper" program="${k}">
                                    <div class="program-header program-${k}-header">
                                        <i class="program-title left">${programs[k].title}</i>
                                        <i class="program-close click material-icons right" action="program-close" program="${k}">close</i>
                                        <i class="program-fullscreen program-${k}-resize click material-icons right" action="program-fullscreen" program="${k}">fullscreen</i>
                                        <i class="program-${k}-minimize program-minimize click material-icons right" action="program-minimize" program="${k}">minimize</i>
                                        <i class="program-${k}-refresh program-refresh click material-icons right" action="program-refresh" program="${k}">refresh</i>
                                    </div>
                                    ${data}
                                </div>`;
                    
                                $('#programs').append( content );
        
                                // Hides buttons based on the programs options, allowRefresh, allowMinimize, allowResize
                                if ( programs[k].options ) {
                                    if ( !programs[k].options.allowRefresh ) {
                                        $(`.program-${k}-refresh`).remove();
                                    }
        
                                    if ( !programs[k].options.allowMinimize ) {
                                        $(`.program-${k}-minimize`).remove();
                                    }
        
                                    if ( !programs[k].options.allowResize ) {
                                        $(`.program-${k}-resize`).remove();
                                    }
                                } else {
                                    $(`.program-${k}-resize`).remove();
                                    $(`.program-${k}-minimize`).remove();
                                    $(`.program-${k}-refresh`).remove();
                                }                  
                    
                                // Icon to append
                                let icon = `<div title="${ programs[k].title }" class="icon click program-${ k }-icon" action="start-program" program="${ k }"><span class="icons icon-${ k }"></span></div>`;
                    
                                // Will append the icon to the start menu if set to true in the config
                                if ( programs[k].icons.start ) {
                                    $('#windows-start').append( icon );
                                }
                    
                                // Will append the icon to the desktop if set to true in the config
                                if ( programs[k].icons.desktop ) {
                                    $( `.${ slot }-${ row }` ).append( icon );
                                    slot++;

                                    if ( slot === 8 ) { 
                                        slot = 0;
                                        row = 1; 
                                    }

                                    $( '#icon-containers .icon' ).draggable({
                                        cancel: false,
                                        scroll: false,
                                        containment: '#desktop',
                                        start: function() {
                                            $( this ).attr( 'slot', $( this ).parent('.icon-container').index());
                                        },
                                        revert: function ( isValidEl ) {
                                            if( isValidEl ) {
                                                return false;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });
                                }

                                // Will append the icon to the tablet if set to true in the config
                                if ( programs[k].tablet ) {
                                    let content = `<div class="program-wrapper program-tablet-${k}" program="${k}">
                                        <div class="program-header program-${k}-header">
                                            <i class="program-title left">${programs[k].title}</i>
                                            <i class="program-close click material-icons right" action="program-close" program="${k}">close</i>
                                        </div>
                                        ${data}
                                    </div>`;
                        
                                    $('#tablet-programs').append( content );
                                    
                                    $( `.t${ tslot }-t${ trow }` ).append( icon ).find('.icon').attr('action', 'tablet-program');
                                    tslot++;

                                    if ( tslot === 6 ) { 
                                        tslot = 0;
                                        trow = 1; 
                                    }
                                }
                    
                                // Will append the icon to the taskbar if set to true in the config
                                if ( programs[k].icons.taskbar ) {
                                    $('#taskbar-icons').append(`<div title="${programs[k].title}" class="icon click" action="start-program" program="${k}"><span class="icons icon-${k}-small"></span></div>`);
                                }

                                // onStart params, currently used to change the default size of a program aka Fullscreen or Minimized
                                if ( programs[k].onStart ) {
                                    if ( programs[k].onStart.iconDroppable ) {
                                        $( `.program-${ k }-icon` ).droppable({
                                            accept: '.icon',
                                            drop: function( event, ui ) {
                                                ui.draggable.detach().appendTo(`.program-${ k }-droppable`);
                                                ui.draggable.draggable({disabled: true});
                                            }
                                        });
                                    }

                                    if ( !programs[k].onStart.fullscreen ) {
                                        let width = '810px';
                                        let height = '410px';
                                        let top = '65px';
                                        let left = '130px';

                                        if ( programs[k].onStart.width ) {
                                            width = programs[k].onStart.width;
                                        }

                                        if ( programs[k].onStart.height ) {
                                            height = programs[k].onStart.height;
                                        }

                                        let css = {
                                            'top': top,
                                            'left': left,
                                            'width': width,
                                            'height': height
                                        };

                                        if ( programs[k].onStart.top ) {
                                            css['top'] = programs[k].onStart.top;
                                        } else if ( programs[k].onStart.bottom ) {
                                            delete css['top'];
                                            css['bottom'] = `${ parseInt(programs[k].onStart.bottom) + 35 }px`;
                                        } 

                                        if ( programs[k].onStart.left ) {
                                            css['left'] = programs[k].onStart.left;
                                        } else if ( programs[k].onStart.right ) {
                                            delete css['left'];
                                            css['right'] = programs[k].onStart.right;
                                        }


                                        $(`.program-${k}-header`).parent('.program-wrapper').css( css );
                                    } else {
                                        $(`.program-${k}-header`).parent('.program-wrapper').css({
                                            'top': 0,
                                            'left': 0,
                                            'width': '100%',
                                            'height': '94%'
                                        });
                                    }
                                } else {
                                    $(`.program-${k}-header`).parent('.program-wrapper').css({
                                        'top': 0,
                                        'left': 0,
                                        'width': '100%',
                                        'height': '94%'
                                    });
                                }

                                // Makes the program icon draggable because why not
                                $( icon ).draggable();

                                // Makes the program window draggable because why not
                                $(`.program-wrapper`).draggable({
                                    handle: ".program-header",
                                    containment: "#desktop",
                                    start: function () {
                                        $('.program-wrapper').removeClass('program-active');
                                        $(this).addClass('program-active');
                                    }
                                });
                            });
                        }
                    }    
                }
            }
        }
    });

    // Checks if there's a logged in user to show the sign out button
    if ( loggedInUser ) {
        $('#signout').removeClass('hide');
    } else {
        $('#signout').addClass('hide');
    }
}

// LUA event listener
window.addEventListener('message', ( event ) => {
    switch( event.data.action ) {
        // Opens the computer
        case 'open':
            switch( event.data.device ) {
                case 'tablet':
                    $('#computer-frame').hide();
                    $('#tablet-frame').show();

                    $('#tablet-frame').animate({
                        marginTop: '20%',
                    });

                    $('#tablet-screen').css({
                        background: `url(${event.data.desktopBackground}) no-repeat`,
                        backgroundSize: 'cover'
                    });
                    break;
                default:
                    $('#tablet-frame').hide();
                    $('#computer-frame').show();
                    
                    // Sets the background to the specified background in the config.js, the desktop background might be overriden by the logged in user background
                    $('#computer-loading-content').css('background', `url(${event.data.loginBackground}) no-repeat`);
                    $('#computer-content').css('background', `url(${event.data.desktopBackground}) no-repeat`);

                    // Show the body
                    $('#jsfour-computer').show();

                    // The computer location (locations in config.js)
                    let loc = event.data.location;
   
                    // Checks if the player is opening the computer in a new location
                    if ( markerLocation != loc ) {
                        markerLocation = loc;

                        // Checks if the player is required to sign in
                        if ( !event.data.login ) {
                            loggedInUser = null;
                            loadedPrograms = [];

                            loadPrograms();

                            $('#computer-loading').hide();

                            $('#computer-frame').animate({
                                marginTop: '5%',
                            }, 500, () => {
                                setTimeout(() => {
                                    $('#computer-loading-content').fadeIn(500);
                                    $('#login-username').select();
                                }, 1500);
                            });
                        } else {
                            loggedInUser = null;
                            loadedPrograms = [];

                            loadPrograms();

                            sound_turnon.play();

                            $('#computer-loading').show();

                            $('#computer-frame').animate({
                                marginTop: '5%',
                            }, 500, () => {
                                setTimeout(() => {
                                    $('#computer-loading-content').fadeIn(500);
                                    $('#login-username').select();
                                }, 1500);
                            });
                        }

                        // Checks if there's a specified program in the config to auto-run on start. Ugly time out to give the loadPrograms function some time to load in the program
                        if ( event.data.run ) {
                            setTimeout(() => {
                                startProgram(event.data.run);
                            }, 50);
                        } 
                    }
                    break;  
            }
        break;
        case 'token':
            // Sets the token and endpoint when the player connects to the server. Used by the fetch function
            sessionToken = event.data.token;
            endpoint = event.data.endpoint;
            esxEnabled = event.data.esx;
            steam = event.data.steam;
            break;
        case 'toNUI':
            // Data sent from another NUI, it runs the specified toNUI program function, toNUIname(). Check the twitter program for examples
            let data = event.data.data;

            window[`toNUI${data.program}`](data);
        break;
    }
});

// Get the date
function getDate() {
    let today = new Date();

    let month = today.getMonth() + 1;
    let day = today.getDate();

    if ( month < 10 ) { month = `0${month}` }
    if ( day < 10 ) { day = `0${day}` }

    let date = `${today.getFullYear()}-${month}-${day}`;

    return date; 
}

// Get the time
function getTime( seconds ) {
    let today = new Date();

    let hour = today.getHours();
    let minute = today.getMinutes();
    let second = today.getSeconds();

    if ( hour < 10 ) { hour = `0${hour}` }
    if ( minute < 10 ) { minute = `0${minute}` }
    if ( second < 10 ) { second = `0${second}` }

    let time = `${hour}:${minute}`;

    if ( seconds ) {
        time =  `${ hour }:${ minute }:${ second }`;
    } 

    return time;
}

// Show notification (text and material-icons icon required)
function notify( text, icon, program ) {
    sound_notify.play();
    let nElem = $('#notification');

    nElem.find('#notification-icon').text( icon ).attr('program', program);
    nElem.find('p').text( text );

    let appendElem = `<div class="notification click" action="notification" subprogram="${ program }">
        <i class="material-icons">${ icon }</i>
        <p>${ text }</p>
    </div>`;

    $('#notifications-inner-wrapper').prepend( appendElem );
    
    nElem.animate({
        width: 200
    }, 200, () => {
        setTimeout(() => {
            nElem.animate({
                width: 0
            }, 200), () => {
                nElem.find('#notification-icon').text( ' ' );
                nElem.find('p').empty();
            };
        }, 5000);
    });
}

// Display the time in the bottom right corner
function displayTime() {
    $('#taskbar-time').text( getTime() );

    setTimeout(() => {
        displayTime();
    }, 60000);
}

function calendar( month, year ) {
    let days = new Date(year, month, 0).getDate();

    today = new Date();
    day = today.getDate();
    month = today.toLocaleString('default', { month: 'long' });
    dayName = today.toLocaleString('default', { weekday: 'long' });
  
    for (let i = 1; i < days + 1; i++) {
        if ( i === day ) {
            $('#calendar ul').append( `<li class="today"><p class="center-this">${ i }</p></li>` );
        } else {
            $('#calendar ul').append( `<li><p class="center-this">${ i }</p></li>` );
        }
    }

    $('#calendar-time').text( getTime( true ) );
    $('#calendar-date').text( `${ day } ${ month } ${ year }` );
    $('#calendar-month').text(`${ month } ${ year }`);
    $('#calendar-day').text( dayName.charAt(0).toUpperCase() + dayName.slice(1) );
}

// Display error msg, only used by the sign in
function error(msg) {
    $('#computer-error p').text(msg);
    $('#computer-error').slideDown(300, () => {
        setTimeout(() => {
            $('#computer-error').slideUp(300, () => {
                $('#computer-error p').text(' ');
            });
        }, 2000);
    });
}

// Document ready
$(() => {
    displayTime();

    $('#taskbar-date').text( getDate() );

    calendar( parseInt(getDate().split('-')[1]), parseInt(getDate().split('-')[0]) );

    $(`#taskbar-icons`).droppable({
        accept: '.icon',
        drop: function( e, ui ) {
            if ( !$( ui.draggable ).hasClass('ui-droppable') ) {
                ui.draggable.css({
                    'top': 0,
                    'left': 0
                });
    
                $( ui.draggable ).find('span').removeClass(`icon-${ $(ui.draggable).attr('program') }`);
                $( ui.draggable ).find('span').addClass(`icon-${ $(ui.draggable).attr('program') }-small`);
                ui.draggable.detach().appendTo( $( '#taskbar-icons' ) );
                
            } else {
                $( ui.draggable ).draggable({ revert: true });
            }  

            $( '#taskbar-append' ).hide();
        },
        over: function( e, ui ) {
            if ( !$( ui.draggable ).hasClass('ui-droppable') ) {
                $( '#taskbar-append' ).css({
                    bottom: 0,
                    left: ui.draggable[0].offsetLeft
                });
                $( '#taskbar-append' ).show();
            }
        },
        out: () => {
            $( '#taskbar-append' ).hide();
        }
    }); 

    // Submit the login form
    $('#computer-login-submit').submit(() => {
        $('#computer-loading .preloader-wrapper').show();

        let username = $('#login-username').val();
        let password = $('#login-password').val();

        fetch(`http://${ endpoint }/jsfour-core/${ sessionToken }/database/login`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                '@username': username.toLowerCase(),
                '@password': password.toLowerCase()
            })
        })
        .then( response => response.json() )
        .then( data => {
            if ( data != 'false' && data.length > 0 ) {
                loggedInUser = data[0];
                loadedPrograms = [];

                $('#computer-content').css('background', `url(${ loggedInUser.desktop }) no-repeat`);

                loadPrograms();

                if ( !loggedInUser.desktop.includes('assets') ) {
                    // Ugly delay to give the background image to load in properly ^
                    setTimeout(() => {
                        $('#computer-loading .preloader-wrapper').hide();
                        $('#computer-loading').fadeOut('fast');       
                    }, 500);
                } else {
                    // If it's a localy stored image it will skip the ugly delay
                    $('#computer-loading .preloader-wrapper').hide();
                    $('#computer-loading').fadeOut('fast'); 
                }

                sound_signin.play();
            } else {    
                $('#computer-loading .preloader-wrapper').hide();
                error('Wrong username or password..');
            }
        });

        return false;
    });

    // Close NUI - Pressing the ESC key
    $(document).keyup(( e ) => {
        if (e.keyCode === 27) {
            $('#jsfour-computer').hide();
            fetch("http://jsfour-computer/jsfour-computer:close");
        }
    });

    // Disable form submit
    $('.disable-submit').submit(() => { return false; });

    // Disable space on input
    $('.nospace').keydown(( e ) => { if ( e.which === 32) return false; });
});

// Submit the register form - register a user
$('#computer-register-form form').submit(() => {
    fetch(`http://${ endpoint }/jsfour-core/${ sessionToken }/database/addUser`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            '@uniqueValue': '@username',
            '@username': $('#computer-register-username').val().toLowerCase(),
            '@password': $('#computer-register-password').val().toLowerCase(),
            '@firstname': $('#computer-register-firstname').val().toLowerCase(),
            '@lastname': $('#computer-register-lastname').val().toLowerCase(),
            '@group': 'null',
            '@job': 'null',
            '@avatar': 'https://via.placeholder.com/50x50'
        })
    })
    .then( response => response.json() )
    .then( data => {
        if ( data ) {
            $('#computer-register-form').fadeToggle('fast', () => {
                $('#login-username').val( $('#computer-register-username').val().toLowerCase() );
                $('#login-password').val('');
                $('#computer-login-form').fadeToggle();
            });
        } else {    
            error('Username already exists..');
        }
    });

    return false;
});
