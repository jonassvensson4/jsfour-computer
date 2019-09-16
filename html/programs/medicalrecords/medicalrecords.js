let _page = '.medicalrecords-search';
let _record = false;
let _data = 'null';

function fetchUserRecords( type, data, open ) {
    let fetchType = 'medicalrecordsFetchAll';
    let rows = {};

    if ( type === 'user' ) { 
        fetchType = 'medicalrecordsFetchUser';

        let d = data.split(' ');
        
        rows['@firstname'] = d[0];
        rows['@lastname'] = d[1];
        rows['@dob'] = d[2];

        $( _page ).fadeOut('fast', () => {
            _page = '.medicalrecords-record';
            $( _page ).fadeIn();
        });
    }

    fetch(`http://${ endpoint }/jsfour-core/${ sessionToken }/database/${ fetchType }`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify( rows )
    })
    .then( response => response.json() )
    .then( data => {
        if ( data != 'false' && data.length > 0 ) {
            if ( type === 'user' ) {
                $( '.medicalrecords-record' ).html( ' ' );
                $( '.medicalrecords-record' ).append(`<i class="material-icons mr-back">arrow_back</i><h6>${ rows['@firstname'] } ${ rows['@lastname'] } (${ rows['@dob'] }) Records <i class="material-icons" id="mr-add-shortcut">add</i></h6><ul class="collapsible"></ul>`);

                Object.keys( data ).forEach(( k ) => {
                    let li = `
                    <li>
                        <div class="collapsible-header">
                            <p>${ data[k].title }</p>
                            <p>${ data[k].date }</p>
                            <i class="material-icons mr-delete" identifier="${ data[k].id }">delete</i>
                        </div>
                        <div class="collapsible-body">
                            <p>${ data[k].uploader }</p>
                            <p>${ data[k].text }</p>
                        </div>
                    </li>`;

                    $('.medicalrecords-record').find('.collapsible').append( li );
                });

                $('.collapsible').collapsible();
            } else {
                $( '.medicalrecords-result' ).html( ' ' );

                Object.keys( data ).forEach(( k ) => {
                    let elem = `<div class="col s6 medicalrecords-page" page=".medicalrecords-record" load="true" firstname="${ data[k].name.split(' ')[0] }" lastname="${ data[k].name.split(' ')[1] }" dob="${ data[k].dob }">
                        <div class="search-record">
                            <div class="records">
                                <p class="sr-records">${ data[k].count }</p>
                                <p><i class="material-icons">list_alt</i></p>
                            </div>
                            <p>${ data[k].name.split(' ')[0] } ${ data[k].name.split(' ')[1] }</p>
                            <p class="sr-dob">${ data[k].dob }</p>
                        </div>
                    </div>`;
    
                    $( '.medicalrecords-result' ).append( elem );
                });
            }

            if ( open ) {
                $('.medicalrecords-record').find('.collapsible').collapsible('open', 0);
            }
        }
    });
}

function searchRecords() {
    let search = $('.medicalrecords-search-input').val();

    fetch(`http://${ endpoint }/jsfour-core/${ sessionToken }/database/medicalrecordsSearch`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            '@firstname': search,
            '@lastname': search,
            '@dob': search
        })
    })
    .then( response => response.json() )
    .then( data => {
        if ( data != 'false' && data.length > 0 ) {
            $( '.medicalrecords-result' ).html( ' ' );
            Object.keys( data ).forEach(( k ) => {
                let elem = `<div class="col s6 medicalrecords-page" page=".medicalrecords-record" load="true" firstname="${ data[k].name.split(' ')[0] }" lastname="${ data[k].name.split(' ')[1] }" dob="${ data[k].dob }">
                    <div class="search-record">
                        <div class="records">
                            <p class="sr-records">${ data[k].count }</p>
                            <p><i class="material-icons">list_alt</i></p>
                        </div>
                        <p>${ data[k].name.split(' ')[0] } ${ data[k].name.split(' ')[1] }</p>
                        <p class="sr-dob">${ data[k].dob }</p>
                    </div>
                </div>`;

                $( '.medicalrecords-result' ).append( elem );
            });
        } else {
            $('.medicalrecords-search-input').addClass('invalid');

            setTimeout(() => {
                $('.medicalrecords-search-input').removeClass('invalid');
            }, 2000);
        }
    });
}

function refreshmedicalrecords() {
    if ( _page === '.medicalrecords-record' ) {
        fetchUserRecords( 'user', _data );
    }

    fetchUserRecords( 'all' );
}

fetchUserRecords( 'all' );

$('.mr-search').click(() => {
    if ( $('.medicalrecords-search-input').val().length > 0 ) {
        searchRecords();
    }
});

$('.mr-clear').click(() => {
    $('.medicalrecords-search-input').val('');

    M.updateTextFields();

    fetchUserRecords( 'all' );
});

$('body').on('click', '.mr-delete', function () {
    let id = $(this).attr('identifier');

    $( this ).closest('li').remove();

    let len = $('.medicalrecords-record .collapsible li').length;

    if ( len === 0 ) {
        $('.medicalrecords-record .collapsible').remove();
    } 

    fetch(`http://${ endpoint }/jsfour-core/${ sessionToken }/database/medicalrecordsDelete`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            '@id': id
        })
    });

    fetchUserRecords( 'all' );
});

$('body').on('click', '.mr-back', function () {
    $( _page ).fadeOut('fast', () => {
        _page = '.medicalrecords-search';
        $( _page ).fadeIn();
    });
});

$('body').on('click', '.mr-add-shortcut', function () {
    $( _page ).fadeOut('fast', () => {
        _page = '.medicalrecords-add';

        let data = _data.split(' ');

        $('.medicalrecords-add-firstname').val( data[0] );
        $('.medicalrecords-add-lastname').val( data[1] );
        $('.medicalrecords-add-dob').val( data[2] );

        M.updateTextFields();

        $( _page ).fadeIn();
    });
});

$('body').on('click', '.medicalrecords-page', function () {
    let page = $( this ).attr( 'page' );

    if ( $( this ).attr( 'load' ) ) {
        let data = `${ $( this ).attr( 'firstname' ) } ${ $( this ).attr( 'lastname' ) } ${ $( this ).attr( 'dob' ) }`;

        if ( _data != data ) {
            _data = data;
            fetchUserRecords( 'user', _data );
            $('.medicalrecords-search-input').val('');
            fetchUserRecords( 'all' );
        }
    }

    if ( page != _page && $( page ).contents().length > 1 ) {
        $( _page ).fadeOut('fast', () => {
            _page = page;
            $( _page ).fadeIn();
        });
    }
});

$('.medicalrecords-search-form').submit(() => {
    searchRecords();

    return false;
});

$('.medicalrecords-add-form').submit(() => {
    let inputs = $('.medicalrecords-add-form').find('input');
    let rows = {};

    rows['@text'] = $('.medicalrecords-add-form').find('textarea').val();
    rows['@date'] = getDate();
    rows['@uploader'] = `${ loggedInUser.firstname } ${ loggedInUser.lastname }`;

    for ( let i = 0; i < inputs.length; i++ ) {
        if ( inputs.eq(i).val() ) {
            rows[`@${inputs.eq(i).attr('id').split('-')[2]}`] = inputs.eq(i).val().toLowerCase();
        }
    }

    fetch(`http://${ endpoint }/jsfour-core/${ sessionToken }/database/medicalrecordsAdd`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify( rows )
    })
    .then( () => {
        $('.medicalrecords-add-form input, .medicalrecords-add-form textarea').addClass( 'valid' );

        setTimeout(() => {
            fetchUserRecords( 'all' );

            let d = `${ $('.medicalrecords-add-firstname').val() } ${ $('.medicalrecords-add-lastname').val() } ${ $('.medicalrecords-add-dob').val() }`

            fetchUserRecords( 'user', d, true );

            $('.medicalrecords-add-form input').val('');
            $('.medicalrecords-add-form textarea').val('');

            $( '.valid' ).removeClass( 'valid' ); 

            M.updateTextFields();
            
            $( _page ).fadeOut('fast', () => {
                _page = '.medicalrecords-record';
                $( _page ).fadeIn();
            });
        }, 1500);
    });

    return false;
});