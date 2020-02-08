let vehicles;
let blacklistedCategory = ['military', 'industrial', 'emergency', 'utility', 'helicopters', 'planes', 'service', 'boats', 'commercial'];
let blacklistedVehicle = ['Caracara', 'Insurgent', 'Insurgent Pick-Up', 'Insurgent Pick-Up Custom', 'Menacer', 'Ramp Buggy', 'Technical', 'Technical Aqua', 'Technical Custom', 'Oppressor', 'Oppressor Mk II', 'Vigilante (car)', 'Armored Boxville', 'Turreted Limo', ''];
let categories = [];

$.getJSON('programs/cardealer/vehicles.json', function( data )
{
    vehicles = data;

    Object.keys( vehicles ).forEach(( k ) => {
        let category = k;

        if ( !categories.includes( category ) && !blacklistedCategory.includes( category ) ) {
            categories.push( category );

            let vehicle = Object.keys( vehicles[k] )[0];

            if ( category === 'vans' ) {
                vehicle = Object.keys( vehicles[k] )[3];
            }

            let frontQuarter = vehicles[k][vehicle].frontQuarter;

            let div = `<div class="col s4">
                <a href="#" class="cardealer-category" onclick="showVehicleCategory('${category}')" category="${ category }">
                    <div class="card">
                        <div class="card-image">
                            <img src="${ frontQuarter }" draggable="false">
                        </div>
                        <div class="card-content">
                            <span class="card-title">${ category }</span>
                        </div>
                    </div>
                </a>
            </div>`;

            $('#cardealer-category').append( div );
        }
    });
});

function showVehicleCategory( category ) {
    $('#cardealer-list-content').html('');

    $('#cardealer-category').fadeOut('fast', () => {
        Object.keys( vehicles ).forEach(( k ) => {
            if ( category === k ) {
                let vehicle = vehicles[k];
               
                Object.keys( vehicle ).forEach(( k ) => {
                    let name = k;

                    if ( name.length > 17 ) {
                        name = name.split(' ')[0];
                    }

                    if ( !blacklistedVehicle.includes( k ) ) {
                        if ( vehicle[k].frontQuarter != 'https://vignette.wikia.nocookie.net/gtawiki/images/f/f6/CDG-ImageNeeded.png/revision/latest/scale-to-width-down/210' ) {
                            let div = `<div class="col s4">
                                <a href="#" class="cardealer-vehicle" onclick="showVehicle('${ k }', '${ category }')" category="${ category }" name="${ k }">
                                    <div class="card">
                                        <div class="card-image">
                                            <img src="${ vehicle[k].frontQuarter }" draggable="false">
                                        </div>
                                        <div class="card-content">
                                            <span class="card-title">${ name }</span>
                                        </div>
                                    </div>
                                </a>
                            </div>`;

                            $('#cardealer-list-content').append( div );
                        }
                    }
                });
            }
        });

        $('#cardealer-list-header h6').text( category );
        $('#cardealer-list').fadeIn('slow');
    });
}

function showVehicle( name, category ) {
    div = `
        <img class="vehicle-resize" angle="frontQuarter" src="${vehicles[category][name].frontQuarter.replace('210', '300')}" />
        <img class="vehicle-resize" angle="rearQuarter" src="${vehicles[category][name].rearQuarter.replace('210', '300')}" />
        <img class="vehicle-resize" angle="front" src="${vehicles[category][name].front.replace('210', '200')}" />
        <img class="vehicle-resize" angle="side" src="${vehicles[category][name].side.replace('210', '200')}" />
        <img class="vehicle-resize" angle="rear"src="${vehicles[category][name].rear.replace('210', '200')}" />
    `;

    $('#cardealer-vehicle-content').append( div );

    $('#large-image').html('');

    div = `
        <img class="frontQuarter hidden" src="${vehicles[category][name].frontQuarter.replace('210', '700')}" />
        <img class="rearQuarter hidden" src="${vehicles[category][name].rearQuarter.replace('210', '700')}" />
        <img class="front hidden" src="${vehicles[category][name].front.replace('210', '700')}" />
        <img class="side hidden" src="${vehicles[category][name].side.replace('210', '700')}" />
        <img class="rear hidden"src="${vehicles[category][name].rear.replace('210', '700')}" />
    `;

    $('#large-image').append( div );

    // Ugly timeout to give some extra time for the images to load..
    $('#cardealer-list').fadeOut(500, () => {
        $('#cardealer-vehicle h6').text( name );
        $('#cardealer-vehicle').fadeIn('fast');
    });
}

$('body').on('click', '.cardealer-header i', function () {
    back = $(this).attr('back');

    if ( back === 'category' ) {
        $('#cardealer-list').fadeOut('fast', () => {
            $('#cardealer-category').fadeIn('fast');
        });
    } else {
        $('#cardealer-vehicle').fadeOut('fast', () => {
            $('#cardealer-vehicle-content').html('');
            $('#cardealer-list').fadeIn('fast');
        });
    }
});

let showLarge = false;
let angle;

$('body').on('click', '.vehicle-resize', function () {
    angle = $(this).attr('angle');

    $(`.${angle}`).removeClass('hidden');

    $('#large-image').fadeIn('fast', function() {
        showLarge = true;
    });
});

$('body').on('click', '.program-cardealer', function () {
    if ( showLarge ) {
        $(`.${angle}`).addClass('hidden');
        $('#large-image').hide();
        showLarge = false;
    }
});
