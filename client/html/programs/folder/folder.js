
$('body').on('contextmenu', '.program-folder .icon', ( e ) => { 
    $('#f-contextmenu').css({
        top: $(e.target).position().top + 20,
        left: $(e.target).position().left + 20
    });

    let classes = $( e.target ).parent('.icon').attr('class').split(' ');

    for ( let i = 0; i < classes.length; i++ ) {
        if ( classes[i].includes('program-') ) {
            $('#f-restore').attr('identifier', classes[i]);
        }
    }

    $('#f-contextmenu').show();
    e.preventDefault();
});

$('#f-icons').click(() => {
    $('#f-contextmenu').hide();
});

$('#f-restore').click( function() {
    let ji = false;

    let id = $( this ).attr('identifier');

    for ( let j = 0; j < 8; j++ ) {
        for ( let i = 0; i < 17; i++ ) {
            if ( $(`.${ j }-${ i }`).find('.icon').length === 0 ) {
                if ( !ji ) {
                    ji = true;
                    $(`.${ j }-${ i }`).append( $(`.${ id }`) );
                    $(`.${ id }`).draggable({disabled: false});
                }
            }
        }
    }

    $( `.program-folder .${ id }` ).remove();

    $('#f-contextmenu').hide();
});