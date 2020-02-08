let program;

// Hides the windows-start and the volume-control
function hideWindow( window ) {
    let windows = window.replace(/\n/g, '').replace(/\s/g, '').split(',');

    for ( i in windows ) {
        if ( windows[i] === 'windows-start' || windows[i] === 'volume-control' || windows[i] === 'calendar' ) { 
            $( `#${windows[i]}` ).animate({
                height: '0',
            }, 200, () => {
                $( `#${windows[i]}` ).hide();
            });
        } else if ( windows[i] === 'notifications' ) {
            $('#notifications').animate({
                width: '0',   
            }, 100, () => {
                $('#notifications').hide();
            });
        } else {
            $( '#windows-start' ).animate({
                height: '0',
            }, 200, () => {
                $( '#windows-start' ).hide();
            });

            $( '#volume-control' ).animate({
                height: '0',
            }, 200, () => {
                $( '#volume-control' ).hide();
            });

            $( '#calendar' ).animate({
                height: '0',
            }, 200, () => {
                $( '#calendar' ).hide();
            });

            $('#notifications').animate({
                width: '0',   
            }, 100, () => {
                $('#notifications').hide();
            });
        }
    } 
}

// Desktop click
$('#desktop').click(() => {
    hideWindow( 'all' );
    $(`.small-active`).removeClass('small-active');
});

// Program window clicked
$('body').on('click', '.program-wrapper', function () {
    $('.program-wrapper').removeClass('program-active');
    $(this).addClass('program-active');
    $(`.small-active`).removeClass('small-active');
    $(`.icon-${$(this).attr('program')}-small`).addClass('small-active small-program-icon');
});

// Change the volume
$('body').on('input', '#volume-range', function() {
    volume = $(this).val();
    $('#volume-percentage').text(volume);
    
    Howler.volume(volume / 100);
});

// Start a program
function startProgram( program ) {
    hideWindow( 'all' );

    if ( $(`.icon-${program}-small`).hasClass('small-active') ) {
        $('.small-active').removeClass('small-active');
        $(`.program-${program}`).closest('.program-wrapper').hide();
    } else {
        $(`.program-${program}`).closest('.program-wrapper').show();

        $('.program-wrapper').removeClass('program-active');
        $(`.program-${program}`).closest('.program-wrapper').addClass('program-active');
    
        $(`.small-active`).removeClass('small-active');
    
        if ( $(`.icon-${program}-small`).length === 0 ) {
            $('#taskbar-icons').append(`<div class="icon click" action="start-program" program="${program}"><span class="icons icon-${program}-small"></span></div>`);
            $(`.icon-${program}-small`).addClass('small-active small-border');
        } else {
            $(`.icon-${program}-small`).addClass('small-active small-border');
        }
    }
}

function cInterval() {
    $('#calendar-time').text( getTime( true ) );
}

// .click, requires the attr "action"
$('body').on('click', '.click', function () {
    switch ( $(this).attr('action') ) {
        case 'calendar':
            // Show calendar
            hideWindow( 'volume-control, notifications' );

            calendarOpen = calendarOpen ? false : true;

            if ( calendarOpen ) {
                calendarInterval = setInterval(cInterval, 1000);
            } else {
                clearInterval(calendarInterval);
            }

            $('#calendar').show().animate({
                height: $('#calendar').height() ? 0 : 350
            }, 200);
            break;
        case 'volume':
            // Show volume control
            hideWindow( 'calendar, notifications' );

            $('#volume-control').show().animate({
                height: $('#volume-control').height() ? 0 : 45
            }, 200);
            break;
        case 'volume-mute':
            // Mute the volume
            let volumeIcon = $(this).text() === 'volume_up' ? 'volume_off' : 'volume_up';
            $(this).text( volumeIcon );
            $('#volume-icon').text( volumeIcon );

            volume = 0;
            Howler.volume(volume);
            break;
        case 'notifications':
            // Show notificaitons
            hideWindow( 'volume-control, calendar' );

            $('#notification').animate({
                width: 0
            }, 200);

            $( this ).attr('src', 'assets/images/notifications.png');

            $('#notifications').show().animate({
                width: $('#notifications').width() ? 0 : 220
            }, 200);
            break;
        case 'notification':
            // Remove notification
            if ( $( this ).attr('subprogram') ) {
                startProgram( $( this ).attr('subprogram') );
            }
            $( this ).remove();
            break;
        case 'notification-close':
            $('#notification').animate({
                width: 0
            }, 200);
            break;
        case 'windows-start':
            // Show windows start menu
            $('#windows-start').show().animate({
                height: $('#windows-start').height() ? 0 : 230
            }, 200);
            break;
        case 'windows-minimize-all':
            // Taskbar minimize, hides all programs
            hideWindow( 'all' );
            $(`.small-active`).removeClass('small-active');

            for (let i = 0; i < $('#desktop .program-wrapper').length; i++) {
                prog = $('#desktop .program-wrapper').eq(i).attr('program');
                $(`#desktop .program-${prog}`).closest('.program-wrapper').hide();
            }
            break;
        case 'start-program':
            // Start a program
            startProgram( $( this ).attr('program') );

            if ( $( this ).attr('subprogram') ) {
                $('#notification').animate({
                    width: 0
                }, 200);
            }
            break;
        case 'program-close':
            // Close a program
            program = $(this).attr('program');
            
            let e = $(`#desktop .program-${program}`).closest('.program-wrapper');

            if ( !programs[program].icons.taskbar ) {
                $(`.icon-${program}-small`).closest('.click').remove();
            }

            setTimeout(() => {
                $(`.small-active`).removeClass('small-active small-border');  
            }, 1);
            

            e.hide();
            break;
        case 'program-minimize':
            // Minimize a program
            $(`#desktop .program-${$(this).attr('program')}`).closest('.program-wrapper').hide();
            break;
        case 'program-fullscreen':
            // Toggle fullscreen of a program
            let elem = $(`#desktop .program-${$(this).attr('program')}`).closest('.program-wrapper');

            if ( elem.find('.container').width() >= 700 ) {
                elem.find('.container').css('width', '85%');
            } else {
                elem.find('.container').css('width', '70%');
            }

            elem.css({
                'top': 0,
                'left': 0,
                'width': elem.width() === 1012 ? '810px' : '100%',
                'height': elem.height() === 541 ? '410px' : '94%'
            });
            break;
        case 'program-refresh':
            // Refresh a program, calls the program refresh function refreshprogram() where program is the program name
            window[`refresh${$(this).attr('program')}`]();
            break;
        case 'signout':
            // Sign out the user
            signout();
            break;
        case 'off':
            // Trun off computer
            off();
            break;
        case 'computer-register':
            $('#computer-login-form').fadeToggle('fast', () => {
                $('#computer-register-form').fadeToggle();
            });
            break;
        case 'computer-loading-back':
            $('#computer-register-form').fadeOut('fast', () => {
                $('#computer-login-form').fadeIn();
            });
            break;
        case 'tablet-program':
            $(`.program-tablet-${ $(this).attr('program') }`).show();
            break;
    }
});