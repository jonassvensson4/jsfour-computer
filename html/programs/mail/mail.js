
let userEmails, currentEmail, tempdata;
let currentMail = 0;
let unread = {};
let userMails = {};
let sentNotify = false;

// Fetch mails by email
function fetchMails( mail ) {
    unread = {};

    // Empty all the inboxes
    $('#mail-inbox-inbox, #mail-inbox-sent, #mail-inbox-junk, #mail-inbox-deleted').html('');

    // Fetch from the database
    fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'fetchMail',
            data: {
                '@email': mail
            }
        })
    })
    .then( response => response.json() )
    .then( data => {
        if ( data != 'false' && data.length > 0 ) {
            if ( !tempdata ) {
                tempdata = data;
            }
            // data contains all the mails
            Object.keys( data ).forEach(( k ) => {
                // Store the mails in an object where the id is the key
                userMails[data[k].id] = data[k];

                // Variables to be able to read it better
                let title = data[k].title;
                let name = data[k].name;
                let text = data[k].text;
                let read = 'inbox-unread-false';

                // Change length of strings if it's too big to fit the element
                if ( title.length > 18 ) {
                    title = title.substr(0, 16) + '..';
                }

                if ( name.length > 18 ) {
                    name = name.substr(0, 18);
                }

                if ( text.length > 18 ) {
                    text = text.substr(0, 18) + '..';
                }

                // Used by the notification to be able to tell if there's any unread mails
                if ( !unread[data[k].to] ) {
                    unread[data[k].to] = 0;
                }
  
                // If there's an unread mail..
                if ( !data[k].read ) {
                    // Loops through every email the user has
                    $('#mail-menu-emails .mail-menu-content').each( function () {
                        // Adds the unread count to the correct email
                        if ( data[k].to === $( this ).find('.mail-menu-email').text() ) {
                            unread[data[k].to]++;
                            $( this ).find('.mail-unread-count').text( unread[data[k].to] );
                        }
                    });

                    // Unread class to add a different style
                    read = 'inbox-unread';
                }

                if ( tempdata === data ) {
                    // Element to append
                    let div = `<div class="mail-inbox-content ${ read }" identifier="${ data[k].id }">
                        <img class="inbox-avatar circle" src="${ data[k].avatar }" />
                        <p class="inbox-name">${ name }</p>
                        <p class="inbox-title">${ title }</p>
                        <p class="inbox-text">${ text }</p>
                    </div>`;

                    // Checks if the user has sent the email or not to append it to the sent folder
                    if ( mail != data[k].from ) {
                        $( `#mail-inbox-${ data[k].folder }` ).prepend( div );
                    } else if ( mail === data[k].from && mail === data[k].to ) {
                        $( `#mail-inbox-${ data[k].folder }` ).prepend( div );
                    } else {
                        $( `#mail-inbox-sent` ).prepend( div );
                    }
                } else {
                    if ( Object.keys( data ).length === parseInt( k ) + 1 ) {
                        tempdata = false;
                    } 
                }
            });

            // Loops through every unread mail since it's stored in an object to be able to tell which email has unread mails
            Object.keys( unread ).forEach(( k ) => {
                // This is only supposed to run on start, therefore the sentNotify variable
                if ( unread[k] > 0 && !sentNotify ) {
                    sentNotify = true;

                    // Send mail after 1.2 sec to give the user time to login
                    setTimeout(() => {
                        notify('New mail!', 'mail', 'mail');
                    }, 1200);
                }
            });
        }
    });  
}

function fetchEmails() {
    fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'fetchUserEmails',
            data: {
                '@id': loggedInUser.id
            }
        })
    })
    .then( response => response.json() )
    .then( data => {
        if ( data.length > 0 ) {
            userEmails = data;

            Object.keys( userEmails ).forEach(( k, i ) => {
                fetchMails( userEmails[k].email );
                
                let div = ` <div class="mail-menu-content waves-effect waves-light change${ i }" onclick="changeEmail('${ userEmails[k].email }', '${ i }')">
                    <p>Mail</p>
                    <p class="mail-menu-email">${ userEmails[k].email }</p>
                    <span class="mail-unread-count"></span>
                </div>`;
            
                $('#mail-menu-emails').append( div);

                setTimeout(() => {
                    $('.mail-menu-content').eq(0).addClass('active-email');
                }, 100);
            });
            
            currentEmail = userEmails[0].email;

            $('#mail-send-from').val( currentEmail );
            $(`.changeFolder`).eq(0).addClass('active-folder');

            $('#mail-register').fadeOut();
            $('#mail-content-wrapper').show(); 
        }  else {
            $('#mail-content-wrapper').hide();
            $('#mail-register').show();
        }
    });
}

fetchEmails();

function sendMail() {
    fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'sendMail',
            data: {
                '@from': $('#mail-send-from').val().toLowerCase(),
                '@to': $('#mail-send-to').val().toLowerCase(),
                '@text': $('#mail-send-text').val(),
                '@date': getDate(),
                '@read': 0,
                '@avatar': loggedInUser.avatar,
                '@name': `${ loggedInUser.firstname } ${ loggedInUser.lastname }`,
                '@title': $('#mail-send-title').val()
            }
        })
    })
    .then(() => {
        $('#mail-send-to').val('');
        $('#mail-send-title').val('');
        $('#mail-send-text').val('');

        fetchMails( currentEmail );
    });
}

$('#mail-send-submit').click(() => {
    if ( $('#mail-send-from').val().length > 0 && $('#mail-send-to').val().length > 0 ) {
        sendMail();
    }
});

function changeFolder( folder ) {
    $('.active-folder').removeClass('active-folder');
    $(`.folder-${ folder }`).addClass('active-folder');
    $('.afolder').hide();
    $('#mail-email').hide();
    $(`#mail-inbox-${ folder }`).show();
    $('#mail-delete').attr('folder', folder);
}

function changeEmail( email, i ) {
    tempdata = false;
    currentEmail = email;

    $('.active-email').removeClass('active-email');
    $(`.change${ i }`).addClass('active-email');

    $('#mail-send-from').val( currentEmail );

    fetchMails( currentEmail )

    $('#mail-email').hide();
}

function refreshmail() {
    fetchMails( currentEmail );
}

$('#mail-inbox, #mail-send, #mail-toggle, #mail-send-page, #mail-menu-emails, .changeFolder').click(() => {
    if ( $('#mail-folder-menu').css('display') === 'block' ) {
        $('#mail-folder-menu').hide();
    }
});

$('#mail-folder').click(() => {
    $('#mail-folder-menu').toggle();
});

// Ugly toggle because I'm lazy
$('#mail-toggle').click(() => {
    $('#mail-menu h6').toggle();

    if ( $('#mail-toggle').css('marginTop') === '0px' ) {
        $('#mail-menu').animate({
            width: 35
        }, 200);
        $('#mail-inbox').animate({
            left: 35
        }, 200);
        $('#mail-email').animate({
            left: 235
        }, 200);
        $('#mail-send').animate({
            left: 235
        }, 200);
        $('#mail-folder-menu').animate({
            left: 35
        }, 200);
        $('#mail-toggle').css('marginTop', '26px');
        $('.mail-menu-content').hide();
        $('#mail-menu .changeFolder').hide();
    } else {
        $('#mail-toggle').css('marginTop', '0px');
        $('.mail-menu-content').show();
        $('#mail-menu .changeFolder').show();
        $('#mail-menu').animate({
            width: 180
        }, 200);
        $('#mail-inbox').animate({
            left: 180
        }, 200);
        $('#mail-email').animate({
            left: 380
        }, 200);
        $('#mail-send').animate({
            left: 380
        }, 200);
        $('#mail-folder-menu').animate({
            left: 180
        }, 200);
    }
});

$('body').on('click', '.mail-inbox-content', function() {
    $('#mail-send').hide();
    $( '.inbox-active' ).removeClass('inbox-active');
    if ( currentMail === $( this ).attr( 'identifier' ) ) {
        $('#mail-email').toggle();
    } else {
        currentMail = $( this ).attr( 'identifier' );

        $('#email-avatar').attr('src', userMails[currentMail].avatar);
        $('#email-title').text( userMails[currentMail].title );
        $('#email-name').text( `${ userMails[currentMail].name } <${ userMails[currentMail].from }>` );
        $('#email-date').text( userMails[currentMail].date );
        $('#email-to span').text( userMails[currentMail].to );
        $('#email-text').text( userMails[currentMail].text );
        $('#mail-delete').attr('identifier', currentMail);

        $('#mail-email').show();

        if ( $( this ).hasClass('inbox-unread') ) {
            unread[currentEmail]--;

            $('#mail-menu-emails .mail-menu-content').each( function () {
                if ( currentEmail === $( this ).find('.mail-menu-email').text() ) {
                    if ( unread[currentEmail] === 0 ) {
                        $( this ).find('.mail-unread-count').text('');
                    } else {
                        $( this ).find('.mail-unread-count').text( unread[currentEmail] );
                    }
                }
            });

            fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'updateMailRead',
                    data: {
                        '@id': currentMail
                    }
                })
            });
        }
    }

    $( this ).removeClass('inbox-unread');
    $( this ).addClass('inbox-active');
});

$('#mail-send-page').click(() => {
    $('#mail-email').hide();
    $('#mail-send').show();
});

$('#email-name').click( function () {
    $('#mail-send-to').val($( this ).text().split('<').pop().split('>')[0]);
    $('#mail-email').hide();
    $('#mail-send').show();
});

$('#mail-email-header p').click( function() {
    switch( $( this ).attr('action') ) {
        case 'delete':
            switch ( $( this ).attr('folder') ) {
                case 'sent':
                case 'junk':
                case 'inbox':
                    fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                        method: 'POST',
                        body: JSON.stringify({
                            type: 'updateMailFolder',
                            data: {
                                '@id': $( this ).attr('identifier'),
                                '@folder': 'deleted'
                            }
                        })
                    })
                    .then(() => {
                        let div = `<div class="mail-inbox-content" identifier="${ $( this ).attr('identifier') }">
                            <img class="inbox-avatar circle" src="${ $('#email-avatar').attr('src') }" />
                            <p class="inbox-name">${ $('#email-name').text() }</p>
                            <p class="inbox-title">${ $('#email-title').text() }</p>
                            <p class="inbox-text">${ $('#email-text').text() }</p>
                        </div>`;
    
                        $( '.inbox-active' ).remove();
                        $( `#mail-inbox-deleted` ).prepend( div );
                    });
                    break;
                case 'deleted':
                    fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                        method: 'POST',
                        body: JSON.stringify({
                            type: 'deleteMail',
                            data: {
                                '@id': $( this ).attr('identifier')
                            }
                        })
                    })
                    .then(() => {
                        $( '.inbox-active' ).remove();
                    });
                    break;
            }
            break;
        case 'forward':
            $('#mail-email').hide();

            $('#mail-send-title').val( `Forwarded: ${ $('#email-title').text() }` );
            $('#mail-send-text').val( `Forwarded from: ${ $( '#email-name' ).text().split('<').pop().split('>')[0] }\n\n${ $('#email-text').text() }` );

            $('#mail-send').show();
            break;
        case 'reply':
            $('#mail-email').hide();

            $('#mail-send-title').val( `Reply - ${ $('#email-title').text() }` );
            $('#mail-send-text').val( `\n\n\n\nReceived ${ $( '#email-date' ).text() }:\nFrom: ${ $( '#email-name' ).text() }\n\n${ $( '#email-text' ).text() }`);

            $('#mail-send').show();
            break;
    }
});

$('#mail-register form').submit(() => {
    let registerEmail = `${ $('#mail-register-name').val().toLowerCase() }@${ $('#mail-register-domain').val().toLowerCase() }`;

    fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'fetchEmail',
            data: {
                '@email': registerEmail
            }
        })
    })
    .then( response => response.json() )
    .then( data => {
        if ( data != 'false' && data.length === 0 ) {
            $('#mail-register-name, #mail-register-domain').removeClass('invalid');

            fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'registerMail',
                    data: {
                        '@id': loggedInUser.id,
                        '@folder': 'registry',
                        '@email': registerEmail
                    }
                })
            })
            .then(() => {
                fetchEmails();
            });
        } else {
            $('#mail-register h6').text('Email already exist..');
            $('#mail-register-name, #mail-register-domain').addClass('invalid');

            setTimeout(() => {
                $('#mail-register h6').text('Welcome!');
                $('#mail-register-name, #mail-register-domain').removeClass('invalid');
            }, 2500);
        }
    });

    return false;
});