let wait = false;
let esxEnabled = false;
let ESX = false;
let callbacks = {};

// Register client events
RegisterNetEvent('jsfour-computer:toNUI');
RegisterNetEvent('jsfour-computer:esxStatus');
RegisterNetEvent('jsfour-computer:callback');

// Register NUI callbacks
RegisterNuiCallbackType('jsfour-computer:emitNet');
RegisterNuiCallbackType('jsfour-computer:esx');
RegisterNuiCallbackType('jsfour-computer:close');
RegisterNuiCallbackType('jsfour-computer:tempData');

onNet('jsfour-computer:callback', ( result, id ) => {
    callbacks[id](result);
    delete callbacks[id];
});

// Server callback
function serverCallback( name, data, cb ) {
    let id = Object.keys( callbacks ).length++;
    callbacks[id] = cb;
    data['CallbackID'] = id;
    emitNet(name, data);
}

for ( let i = 0; i < NUICallbacks.length; i++ ) {
    setTimeout(() => {
        let name = NUICallbacks[i];

        RegisterNuiCallbackType(name);
        RegisterNetEvent(name);
    
        on(`__cfx_nui:${ name }`, ( data, cb ) => {
            data['clientEvent'] = name;
            
            serverCallback('jsfour-computer:query', data, ( callback ) => {
                cb(callback);
            });
        });
    }, i * 200 );
}

// Triggered when a player sends data to another player
onNet('jsfour-computer:toNUI', ( data ) => {
    SendNuiMessage(JSON.stringify({
        action: 'toNUI',
        data: data,
    }));
});

// Get the ESX status from the server
setTimeout(() => {
    serverCallback('jsfour-computer:esxStatus', 'esxStatus', ( status ) => {
        esxEnabled = status;
    
        setTimeout(() => {
            SendNuiMessage(JSON.stringify({
                action: 'esxStatus',
                status: esxEnabled,
            }));
        }, 100)
    });    
}, 1000);

// Check distance between the player and the locations
function checkDistance( pos ) {
    let location = false;
    let pedCoords = GetEntityCoords(GetPlayerPed(-1));

    if ( !pos ) {
        Object.keys( locations ).forEach( ( key ) => {
            let distance = GetDistanceBetweenCoords(pedCoords[0], pedCoords[1], pedCoords[2], locations[key].coords.x, locations[key].coords.y, locations[key].coords.z, true)
    
            if ( distance < locations[key].marker.drawDistance ) {
                location = {
                    distance: distance,
                    key: key,
                }
            }
        });
    } else {
        let distance = GetDistanceBetweenCoords(pedCoords[0], pedCoords[1], pedCoords[2], locations[pos].coords.x, locations[pos].coords.y, locations[pos].coords.z, true)

        location = {
            distance: distance,
            key: pos
        }
    }
    
    return location;
}

// Remove NUI focus on start (incase of a resource restart)
setImmediate(() => {
    SetNuiFocus(false, false);
});

// Keypress event and display marker if enabled in the config. Also loads in ESX if it's installed
setTick(() => {
    if ( esxEnabled ) {
        while ( !ESX ) {
            emit('esx:getSharedObject', ( obj ) => {
                ESX = obj;
            });
        }
    }

    if ( displayMarkers ) {
        if ( !wait ) {
            if ( checkDistance() ) {
                // TODO: hints
                let location = locations[checkDistance().key];
                DrawMarker(location.marker.type, location.coords.x, location.coords.y, location.coords.z, 0.0, 0.0, 0.0, 0, 0.0, 0.0, location.marker.size.x, location.marker.size.y, location.marker.size.z, location.marker.color.r, location.marker.color.g, location.marker.color.b, 100, false, true, 2, false, false, false, false);
            } else {
                wait = true;
    
                setTimeout(() => {

                    wait = false;
                }, 1000);
            }
        } 
    }

    if ( IsControlJustReleased(0, key) ) {
        if ( checkDistance() ) {
            SetNuiFocus(true, true);

            let key = checkDistance().key;
            let location = locations[key];

            SendNuiMessage(JSON.stringify({
                action: 'open',
                device: 'computer',
                location: key,
                loginLogo: location.loginLogo,
                loginBackground: location.loginBackground,
                excludePrograms: location.excludePrograms,
                desktopBackground: location.desktopBackground,
                overrideBackground: location.overrideBackground,
                job: location.job,
                login: location.login,
                run: location.run
            }));
        }
    }
});

// A command that opens the computer if the player is near a location, if enabled in the config
if ( commands.computer.enable ) {
    RegisterCommand(commands.computer.name, (source, args) => {
        if ( checkDistance() || commands.computer.disableDistance ) {
            if ( args[0] ) {
                SetNuiFocus(true, true);

                let key = args[0];
                let location = locations[key];
    
                SendNuiMessage(JSON.stringify({
                    action: 'open',
                    device: 'computer',
                    location: key,
                    loginLogo: location.loginLogo,
                    loginBackground: location.loginBackground,
                    excludePrograms: location.excludePrograms,
                    desktopBackground: location.desktopBackground,
                    overrideBackground: location.overrideBackground,
                    job: location.job,
                    login: location.login,
                    run: location.run
                }));
            } else {
                console.error(`Command missing arguments, usage: /${ commands.computer.name } location`);
            }
        }
    });
}

// Run a query < called from NUI
on('__cfx_nui:jsfour-computer:query', ( data, cb ) => {
    serverCallback('jsfour-computer:query', data, ( callback ) => {
        cb(callback);
    });
});

// emitNet < called from NUI
on('__cfx_nui:jsfour-computer:emitNet', ( data ) => {
    emitNet('jsfour-computer:emitNet', data);
    cb(true);
});

// Get temporaryly saved data on the server < called from NUI
on('__cfx_nui:jsfour-computer:tempData', ( data, cb ) => {
    serverCallback('jsfour-computer:tempData', data, ( callback ) => {
        cb(callback);
    });
});

// Remove NUI focus < called from NUI
on('__cfx_nui:jsfour-computer:close', ( data, cb ) => {
    SetNuiFocus(false, false);
    cb(true);
});

// ESX functions required by some ESX programs, will only work if ESX has been installed
on('__cfx_nui:jsfour-computer:esx', ( data, cb ) => {
    switch ( data.function ) {
        case 'society':
            switch ( data.event ) {
                case 'getMoney': 
                    ESX.TriggerServerCallback('esx_society:getSocietyMoney', ( money ) => {
                        cb( money );
                    }, data.job);
                    break;
                case 'withdraw':
                    emitNet('esx_society:withdrawMoney', data.job, data.amount);
                    cb(true);
                    break;
                case 'deposit':
                    emitNet('esx_society:depositMoney', data.job, data.amount);
                    cb(true);
                    break;
                case 'getEmployees':
                    ESX.TriggerServerCallback('esx_society:getEmployees', ( employees ) => {
                        cb( employees );
                    }, data.job);
                    break;
                case 'getJob':
                    ESX.TriggerServerCallback('esx_society:getJob', ( job ) => {
                        cb( job.grades );
                    }, data.job);
                    break;
                case 'setSalary':
                    ESX.TriggerServerCallback('esx_society:setJobSalary', function() {
                        cb(true);
                    }, data.job, data.grade, data.amount);
                    break;
                case 'fire':
                    ESX.TriggerServerCallback('esx_society:setJob', function() {
                        cb(true);
                    }, data.identifier, 'unemployed', 0, 'fire');
                    break;
                case 'changeGrade':
                    ESX.TriggerServerCallback('esx_society:setJob', function() {
                        cb(true);
                    }, data.identifier, data.job, data.grade, 'promote');
                    break;
            }
            break;
    }
});
