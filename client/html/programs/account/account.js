Object.keys(loggedInUser).forEach( ( k ) => {
    if ( k != 'password' ) {
        $(`#account-${k}`).val(loggedInUser[k]);
    }
});

$('#account-username').attr('identifier', loggedInUser.id);

if ( loggedInUser.group === 'admin' ) {
    $('#account-job').attr('disabled', false);
    $('#account-group').attr('disabled', false);
}

M.updateTextFields();

$('#account-form').submit( () => {
    $('.helper-text').attr('data-error', '');
    $('.invalid').removeClass('invalid');
    $('.valid').removeClass('valid');

    let inputs = $('#account-form').find('input');
    let rows = {};
    let same = 0;
    let update = true;
    
    for ( let i = 0; i < inputs.length; i++ ) {
        if ( inputs.eq(i).val() ) {
            if ( $('#account-new-password0').val() || $('#account-new-password1').val() ) {
                if ( $('#account-new-password0').val() === $('#account-new-password1').val() ) {
                    rows[`@${inputs.eq(i).attr('id').split('-')[1]}`] = inputs.eq(i).val().toLowerCase();
                } else {
                    $('#account-new-password0').addClass('invalid');
                    $('#account-new-password1').addClass('invalid');

                    $('#account-new-password-helper').attr('data-error', `The passwords doesn't match`);
                }
            } else {
                rows[`@new`] = inputs.eq(1).val();
                rows[`@${inputs.eq(i).attr('id').split('-')[1]}`] = inputs.eq(i).val().toLowerCase();
            }
        }
    }
    
    Object.keys(rows).forEach( ( k ) => {
        let row = k.substr(1);

        if ( row != 'new' ) {
            if ( loggedInUser[row] === rows[k] ) {
               same++;
            }
        }
    });

    if ( same === inputs.length ) {
        if ( !$('#account-new-password0').val() || !$('#account-new-password1').val() ) {
            update = false;

            $('.program-account input').addClass('invalid');
            $('#account-username-helper').attr('data-error', `You haven't updated any fields..`);
        }
    } else {
        if ( $('#account-new-password0').val() ) {
            loggedInUser['password'] = $('#account-new-password0').val().toLowerCase();
        }

        $('#computer-content').css('background', `url(${ $('#account-desktop').val() }) no-repeat`);
        $('#computer-content').css('background-size', `cover`);

        Object.keys(rows).forEach( ( k ) => {
            let row = k.substr(1);

            if ( row != 'new' && row != 'password' ) {
                loggedInUser[row] = rows[k];
            }
        });
    }

    if ( update ) {
        rows['@id'] = $('#account-username').attr('identifier');
 
        fetch(`https://${ GetParentResourceName() }/jsfour-computer:updateUser`, {
            method: 'POST',
            body: JSON.stringify({
                type: 'updateUser',
                data: rows
            })
        })
        .then( response => response.text() )
        .then( text => {
            if ( text != 'false' ) {
                $('#account-form input').addClass('valid');

                if ( $('#account-avatar').val() != loggedInUser.avatar ) { 
                    fetch(`https://${ GetParentResourceName() }/jsfour-computer:updateForumAvatar`, {
                        method: 'POST',
                        body: JSON.stringify({
                            type: 'updateForumAvatar',
                            data: {
                                '@avatar': $('#account-avatar').val(),
                                '@username': $('#account-username').val()
                            }
                        })
                    });
                }
            } else {
                inputs.eq(1).addClass('invalid');
                $('#account-username-helper').attr('data-error', `Wrong password`);
            }
        });
    }

    return false;
});

$('.nospace').keydown(( e ) => { if ( e.which === 32) return false; });