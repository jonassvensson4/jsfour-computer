let blacklistedCategory = ['military', 'industrial', 'emergency', 'utility', 'helicopters', 'planes', 'service', 'boats', 'commercial', 'trains'];
let blacklistedVehicle = ['caracara', 'insurgent', 'insurgent pick-up', 'insurgent pick-ip custom', 'menacer', 'ramp buggy', 'technical', 'technical aqua', 'technical custom', 'oppressor', 'oppressor mk ii', 'vigilante (car)', 'armored boxville', 'turreted limo'];
let showLarge = false;
let currentAngle;

fetch('https://gta.now.sh/api/vehicles/class')
.then(response => response.json())
.then(categories => {
    Object.keys( categories ).forEach(category => {
        if ( !blacklistedCategory.includes(category) ) {
            let div = `<div class="col s4">
                <a href="#?cardealer-category=${ category }" class="cardealer-category" onclick="showVehicleCategory('${category}')">
                    <div class="card">
                        <div class="card-image">
                            <img src="${ categories[category] }" draggable="false">
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

function showLargeImage( angle ) {
    currentAngle = angle;
    
    $(`.${ angle }`).removeClass('hidden');

    $('#large-image').fadeIn('fast', function() {
        showLarge = true;
    });
}

function showVehicle( vehicleName ) {
    $('#large-image').html('');

    fetch(`https://gta.now.sh/api/vehicles/${ vehicleName }`)
    .then(response => response.json())
    .then(vehicle => {
        let divSmallerImages = '';
        let divLargerImages = '';

        Object.keys( vehicle.images ).forEach(angle => {
            divSmallerImages += `<img class="vehicle-image" src="${ vehicle.images[angle] }" onclick="showLargeImage('${ angle }')" />`;
            divLargerImages += `<img class="${ angle } hidden" src="${ vehicle.images[angle].replace('210', '700') }" />`;
        });

        $('#cardealer-vehicle-content').html('');
        $('#large-image').html('');

        $('#cardealer-vehicle-content').append( divSmallerImages );
        $('#large-image').append( divLargerImages );

        $('#vehicle-model').text(vehicle.model);
        $('#vehicle-manufacturer').text(vehicle.manufacturer);
        $('#vehicle-seats').text(vehicle.seats);
        $('#vehicle-price').text(vehicle.price);

        $('#vehicle-speed .stat-amount').text(vehicle.speed);
        $('#vehicle-speed .stat-bar').css({ width: `${ vehicle.speed }%` });
        $('#vehicle-acceleration .stat-amount').text(vehicle.acceleration);
        $('#vehicle-acceleration .stat-bar').css({ width: `${ vehicle.acceleration }%` });
        $('#vehicle-braking .stat-amount').text(vehicle.braking);
        $('#vehicle-braking .stat-bar').css({ width: `${ vehicle.braking }%` });
        $('#vehicle-handling .stat-amount').text(vehicle.handling);
        $('#vehicle-handling .stat-bar').css({ width: `${ vehicle.handling }%` });
        
        if ( vehicle.topSpeed ) {
            $('#vehicle-topspeed').text(`${ vehicle.topSpeed.mph } mph | ${ vehicle.topSpeed.kmh } kmh`);
        }
        
        // Ugly timeout to give some extra time for the images to load..
        $('#cardealer-list').fadeOut(500, () => {
            $('#cardealer-vehicle h6').text( vehicleName );
            $('#cardealer-vehicle').fadeIn('fast');
        });
    });
}

function showVehicleCategory( category ) {
    $('#cardealer-list-content').html('');

    fetch(`https://gta.now.sh/api/vehicles/class/${ category }`)
    .then(response => response.json())
    .then(vehicles => {
        $('#cardealer-category').fadeOut('fast', () => {
            Object.keys( vehicles ).forEach(vehicle => {
                if ( !blacklistedVehicle.includes( vehicle ) ) {
                    let div = `<div class="col s4">
                        <a href="#?cardealer-category=${ category }&cardealer-vehicle=${ vehicle }" class="cardealer-vehicle" onclick="showVehicle('${ vehicle }')">
                            <div class="card">
                                <div class="card-image">
                                    <img src="${ vehicles[vehicle].images.frontQuarter }" draggable="false">
                                </div>
                                <div class="card-content">
                                    <span class="card-title">${ vehicle }</span>
                                </div>
                            </div>
                        </a>
                    </div>`;

                    $('#cardealer-list-content').append( div );
                }
            });
        });

        $('#cardealer-list-header h6').text( category );
        $('#cardealer-list-content').scrollTop();
        $('#cardealer-list').fadeIn('slow');
    });
}

function goBack( type) {
    if ( type === 'category' ) {
        $('#cardealer-list').fadeOut('fast', () => {
            $('#cardealer-category').fadeIn('fast');
        });
    } else {
        $('#cardealer-vehicle').fadeOut('fast', () => {
            $('#cardealer-vehicle-content').html('');
            $('#cardealer-list').fadeIn('fast');
        });
    }
}

$('body').on('click', '.program-cardealer', () => {
    if ( showLarge ) {
        $(`.${ currentAngle }`).addClass('hidden');
        $('#large-image').hide();
        showLarge = false;
    }
});