let jobs = {};

function fetchAllAds() {
    $('#jc-jobs').html('');

    fetch(`https://${ GetParentResourceName() }/jsfour-computer:fetchAllJobAds`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'fetchAllJobAds'
        })
    })
    .then( response => response.json() )
    .then( data => {
        if ( data != 'false' && data.length > 0 ) {
            $('#jc-list h6 span').text( Object.keys( data ).length );

            Object.keys( data ).forEach(( k ) => {
                if ( !data[k].title ) {
                    data[k].title = 'This is a null title'
                } else {
                    if ( data[k].title.length > 25 ) {
                        data[k].title = data[k].title.substr(0, 25) + '..';
                    }
                }

                jobs[ data[k].id ] = {
                    id: data[k].id,
                    image: data[k].image,
                    title: data[k].title,
                    group: data[k].group,
                    job: data[k].name,
                    text: data[k].text
                };

                let div = `<div class="jc-job" identifier="${ data[k].id }">
                    <img src="${ data[k].image }" draggable="false" />
                    <h5>${ data[k].title }</h5>
                    <p>${ data[k].name }</p>
                </div>`;

                $('#jc-jobs').prepend( div );
            });
        } 
    });
}

function searchAds( keyword ) {
    Object.keys( jobs ).forEach(( k ) => {
        if ( jobs[k].job.toLowerCase().includes( keyword.toLowerCase() ) ) {
            $('#jc-jobs').html('');

            let div = `<div class="jc-job" identifier="${ jobs[k].id }">
                <img src="${ jobs[k].image }" draggable="false" />
                <h5>${ jobs[k].title }</h5>
                <p>${ jobs[k].job }</p>
            </div>`;

            $('#jc-jobs').append( div );
        }
    });
}

function refreshjobcenter() {
    fetchAllAds();
}

fetchAllAds();

if ( loggedInUser.job === 'all' || ( loggedInUser.group === 'admin' ) ) {
    $('#jc-add').css('display', 'block');
}

$('#jc-add').click(()=> {
    $('#jc-search span').show();
    $('#jc-search form').slideUp('fast');

    $('#jc-list').fadeOut('fast', function() {
        $('#jc-add-form').fadeIn();
    });
});

$('#jc-add-form form').submit(() => {
    fetch(`https://${ GetParentResourceName() }/jsfour-computer:addJobAd`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'addJobAd',
            data: {
                '@group':$('#jc-add-group').val().toLowerCase(),
                '@name': $('#jc-add-name').val().toLowerCase(),
                '@image': $('#jc-add-image').val(),
                '@title': $('#jc-add-title').val(),
                '@text': $('#jc-add-text').val(),
            }
        })
    })
    .then(() => {
        setTimeout(() => {
            fetchAllAds();
            $('#jc-search form').slideDown('fast');
            $('#jc-search span').hide();

            $('#jc-job, #jc-add-form').fadeOut('fast', function() {
                $('#jc-list').fadeIn();
            });
        }, 500);
    });

    return false;
});

$('body').on('click', '.jc-job', function() {
    let ad = $( this ).attr('identifier');

    $('#jc-search span').show();
    $('#jc-search form').slideUp('fast');

    $('#jc-job-title').val( jobs[ad].title );
    $('#jc-job-job').val( jobs[ad].job );
    $('#jc-job-text').val( jobs[ad].text );
    $('#jc-job-image').val( jobs[ad].image );
    $('#jc-job-group').val( jobs[ad].group );
    $('#jc-job-save').attr('identifier', ad);
    $('#jc-job-delete').attr('identifier', ad);

    if ( loggedInUser.job === 'all' || ( loggedInUser.job === jobs[ad].job && loggedInUser.group === 'admin' ) ) {
        $('#jc-job-edit').css('display', 'block');
    }

    $('#jc-list').fadeOut('fast', function() {
        $('#jc-job').fadeIn();
    });
});

$('#jc-search span').click(() => {
    $('#jc-search form').slideDown('fast');
    $('#jc-search span').hide();

    $('#jc-job, #jc-add-form').fadeOut('fast', function() {
        $('#jc-list').fadeIn();
    });
});

function edit() {
    if ( $('#jc-job-save').css('display') === 'block' ) {
        $('#jc-job-save, #jc-job-image, #jc-job-group, #jc-job-delete').css('display', 'none');
    } else {
        $('#jc-job-save, #jc-job-image, #jc-job-group, #jc-job-delete').css('display', 'block');
    }

    $('#jc-job input, #jc-job textarea').attr('disabled',  $('#jc-job input').attr('disabled') ? false : true);
}

$('#jc-job-delete').click( function() {
    fetch(`https://${ GetParentResourceName() }/jsfour-computer:deleteJobAd`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'deleteJobAd',
            data: {
                '@id': $( this ).attr('identifier')
            }
        })
    })
    .then(() => {
        setTimeout(() => {
            fetchAllAds();
            $('#jc-search form').slideDown('fast');
            $('#jc-search span').hide();

            $('#jc-job, #jc-add-form').fadeOut('fast', function() {
                $('#jc-list').fadeIn();
            });
        }, 500);
    });
});

$('#jc-job-edit').click(() => {
    edit();
});

$('#jc-job-save').click( function() {
    fetch(`https://${ GetParentResourceName() }/jsfour-computer:updateJobAd`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'updateJobAd',
            data: {
                '@name': $('#jc-job-job').val(),
                '@text': $('#jc-job-text').val(),
                '@title': $('#jc-job-title').val(),
                '@image': $('#jc-job-image').val(),
                '@group': $('#jc-job-group').val(),
                '@id': $( this ).attr('identifier')
            }
        })
    })
    .then(() => {
        edit();
        fetchAllAds();
    });
});

$('#jc-search button').click(() => {
    if ($('#jc-search input').val().length > 0 ) {
        searchAds( $('#jc-search input').val() );
        return false;
    }
})

$('#jc-search form').submit(() => {
    searchAds( $('#jc-search input').val() );
    return false;
});

$('#jc-search-clear').click(() => {
    if ($('#jc-search input').val().length > 0 ) {
        $('#jc-search input').val('');
        fetchAllAds();
    }
});