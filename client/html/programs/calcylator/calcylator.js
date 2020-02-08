$('.calc-numb').click( function() {
    let text = $( this ).text();
    let currText = $('#calc-enumb').text();

    if ( $( this ).hasClass( 'c-action' ) ) {
        switch( text ) {
            case '±':
                
                break;
            case '⇦':
                $('#calc-enumb').text(`${ currText.substr(0, currText.length - 1) }`);
                break;
            case 'C':
                $('#calc-enumb').text(' ');
                break;
            case 'CE':
                $('#calc-enumb').text(' ');
                break;
            case '=':
                $('#calc-enumb').text( eval( currText.replace(/\s/g, '') ) );
                break;
            case '.':
                $('#calc-enumb').text(`${ currText }${ text }`);
                break;
            default:
                $('#calc-enumb').text(`${ currText } ${ text } `);
        }
    } else {
        $('#calc-enumb').text( currText + text );
    }
});