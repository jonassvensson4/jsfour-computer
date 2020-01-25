function getUsers( job, group ) {
    let fetchType = 'fetchAllUsers';
    let fetchParam = {};
    
    if ( job != 'all' && group  ) {
        fetchType = 'fetchUsersByJob';
        fetchParam = {
            '@job' : job
        }
    }

    if ( job != 'all' ) {
        $('#groups-register-job').val(job);
        $('#groups-update-job').val(job);
        $('#groups-update-job').attr('disabled', true);
        $('#groups-register-job').attr('disabled', true);
        $('#groups-update-job').attr('disabled', true);

        M.updateTextFields();
    }
    
    fetch(`http://${ GetParentResourceName() }/jsfour-computer:query`, {
        method: 'POST',
        body: JSON.stringify({
            type: fetchType,
            data: fetchParam
        })
    })
    .then( response => response.json() )
    .then( data => {
        if ( data != 'false' && data.length > 0 ) {
            $('#program-groups-users').html(' ');

            Object.keys( data ).forEach(( k ) => {
                $('#program-groups-users').append(`<span 
                    identifier="${ data[k].id }" 
                    desktop="${ data[k].desktop }" 
                    avatar="${ data[k].avatar }" 
                    firstname="${ data[k].firstname }" 
                    lastname="${ data[k].lastname }" 
                    username="${ data[k].username }" 
                    password="${ data[k].password }" 
                    job="${ data[k].job }" 
                    group="${ data[k].group }">
                ${ data[k].username }</span>`)
            });

            $('.collapsible').collapsible();
        }
    });
}

function refreshgroups() {
    getUsers( loggedInUser.job, loggedInUser.group );
}

getUsers( loggedInUser.job, loggedInUser.group );

$('body').on('click', '.program-groups .collapsible', function () {
    $('.active').attr('collapsible', $(this).attr('id'));
});

$('body').on('click', '#program-groups-users span', function () {
    let active = $('.active').attr('collapsible');

    if ( active === 'groups-delete-collapsible' ) {
        $('#groups-delete-username').val( $(this).attr('username') );
        $('#groups-delete-username').attr( 'identifier', $(this).attr('identifier') );
        $('#groups-delete-username').attr( 'email', `${ $(this).attr('username').toLowerCase() }@${ $(this).attr('job').toLowerCase() }.com` );

        if ( $(this).attr('job') === 'all' ) {
            $('#groups-delete-user button').attr('disabled', true);
        } else {
            $('#groups-delete-user button').attr('disabled', false);
        }
    } else {
        $('#groups-register-collapsible').collapsible('close');
        $('#groups-delete-collapsible').collapsible('close');

        $('#groups-update-username').val( $(this).attr('username') );
        $('#groups-update-username').attr( 'identifier', $(this).attr('identifier') );
        $('#groups-update-username').attr( 'avatar', $(this).attr('avatar') );

        if ( $(this).attr('job').toLowerCase() != 'null' ) {
            $('#groups-update-username').attr( 'email', `${ $(this).attr('username').toLowerCase() }@${ $(this).attr('job').toLowerCase() }.com` );
        } else {
            $('#groups-update-username').attr( 'email', $(this).attr('job').toLowerCase());
        }

        $('#groups-update-password').val( $(this).attr('password') );
        $('#groups-update-firstname').val( $(this).attr('firstname') );
        $('#groups-update-lastname').val( $(this).attr('lastname') );
        $('#groups-update-group').val( $(this).attr('group') );
        $('#groups-update-avatar').val( $(this).attr('avatar') );
        $('#groups-update-desktop').val( $(this).attr('desktop') );

        if ( loggedInUser.job === 'all' ) {
            $('#groups-update-job').val( $(this).attr('job') );
        }

        $('#groups-update-collapsible').collapsible('open');
    }

    M.updateTextFields();
});

function updateRows( type ) {
    $(`#groups-${type}-user input`).removeClass('valid');
    $(`#groups-${type}-user input`).removeClass('invalid');

    let inputs = $(`#groups-${type}-user`).find('input');
    let rows = {};
    let fetchType = 'addUser';

    for ( let i = 0; i < inputs.length; i++ ) {
        if ( inputs.eq(i).val() ) {
            rows[`@${inputs.eq(i).attr('id').split('-')[2]}`] = inputs.eq(i).val().toLowerCase();
        }
    }

    if ( type != 'register' ) {
        fetchType = 'updateUser';
        rows['@new'] = rows['@password'];
        rows['@id'] = $('#groups-update-username').attr( 'identifier' );
        rows['@email'] = `${ $('#groups-register-username').val().toLowerCase() }@${ $('#groups-register-job').val().toLowerCase() }.com`;
    } else {
        rows['@email'] = `${ $('#groups-register-username').val().toLowerCase() }@${ $('#groups-register-job').val().toLowerCase() }.com`;
        rows['@avatar'] = `https://via.placeholder.com/50/${ (Math.random()*0xFFFFFF<<0).toString(16) }/?text=${ $('#groups-register-username').val().toUpperCase()[0] }` ;
    }

    rows['@uniqueValue'] = '@username';

    fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
        method: 'POST',
        body: JSON.stringify({
            type: fetchType,
            data: rows
        })
    })
    .then( response => response.text() )
    .then( text => {
        if ( text != 'false' ) {
            refreshgroups();

            $(`#groups-${type}-user input`).removeClass('invalid');
            $(`#groups-${type}-user input`).addClass('valid');

            setTimeout(() => {
                $(`#groups-${type}-user input`).removeClass('valid');
            }, 1000);

            if ( $('#groups-update-username').attr('avatar') != loggedInUser.avatar ) {
                fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'updateForumAvatar',
                        data: {
                            '@avatar': $('#groups-update-avatar').val(),
                            '@username': $('#groups-update-username').attr( 'identifier' )
                        }
                    })
                });
            }
            
            if ( type === 'register' ) {
                fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'fetchID',
                        data: {
                            '@username': $('#groups-register-username').val()
                        }
                    })
                })
                .then( response => response.json() )
                .then( data => {
                    if ( parseInt( data[0].id ) ) {
                        fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                            method: 'POST',
                            body: JSON.stringify({
                                type: 'registerMail',
                                data: {
                                    '@id': data[0].id,
                                    '@email': `${ $('#groups-register-username').val().toLowerCase() }@${ $('#groups-register-job').val().toLowerCase() }.com`,
                                    '@folder': $('#groups-update-username').attr( 'identifier' )
                                } 
                            })
                        });
                    }
                });
            } else {  
                fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'updateEmail',
                        data: {
                            '@id': $('#groups-update-username').attr( 'identifier' ),
                            '@email': `${ $('#groups-update-username').val().toLowerCase() }@${ $('#groups-update-job').val().toLowerCase() }.com`,
                            '@oldemail': $('#groups-update-username').attr( 'email' )
                        }
                    })
                });
            }
        } else {
            $(`#groups-${type}-user input`).removeClass('valid');
            $(`#groups-${type}-username`).addClass('invalid');

            setTimeout(() => {
                $(`#groups-${type}-user input`).removeClass('invalid');
            }, 2000);
        }
    });
}

$('#groups-register-user').submit(() => { updateRows('register'); return false; });
$('#groups-update-user').submit(() => { updateRows('update'); return false; });

$('#groups-delete-user').submit(() => { 
    fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'deleteUser',
            data: {
                '@id' : $('#groups-delete-username').attr('identifier')
            }
        })
    })
    .then( response => response.text() )
    .then( data => {
        if ( JSON.parse( data ) ) {
            fetch(`https://${ GetParentResourceName() }/jsfour-computer:query`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    type: 'deleteEmail',
                    data: {
                        '@id': $('#groups-delete-username').attr('identifier'),
                        '@email': $('#groups-delete-username').attr('email')
                    }
                })
            });

            refreshgroups();

            $(`#groups-delete-username`).removeClass('invalid');
            $(`#groups-delete-username`).addClass('valid');

            $('#groups-delete-username').val('');

            setTimeout(() => {
                $(`#groups-delete-username`).removeClass('valid');
            }, 1000);
        } else {
            $(`#groups-delete-username`).removeClass('valid');
            $(`#groups-delete-username`).addClass('invalid');

            setTimeout(() => {
                $(`#groups-delete-username`).removeClass('invalid');
            }, 1000);
        }
    });

    return false; 
});

M.updateTextFields();

$('.nospace').keydown(( e ) => { if ( e.which === 32) return false; });