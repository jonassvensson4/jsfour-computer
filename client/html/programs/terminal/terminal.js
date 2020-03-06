let tHeight = 0;

$('#t-text').empty();

function terminalText( text ) {
    let texts = text.split(',');

    for (let i = 0; i < texts.length; i++) {
        $('#t-text').append( `<p>${ texts[i] }<br/></p>` );
        tHeight += 22;
    }

    $('.program-terminal .program-content').animate({ scrollTop: tHeight });
}

function wrongCommand() {
    terminalText('Wrong command.. Use help');
}

function terminalCmd( cmds ) {
    let cmd = cmds.split(' ');

    terminalText( `${ $('#t-input span').text() + cmd[0]}<br/>` );

    switch( cmd[0] ) {
        case 'ipconfig':
            if ( cmd[1] && cmd[1] === '/all' ) {
                terminalText(`Ethernet adapter Ethernet: <br/>,
                    Connection-specific DNS Suffix  . : lan,
                    Description. . . . . . . . . . . . . . . . . . . : Realtek PCIe GBE Family Controller,
                    Physical Address . . . . . . . . . . . . . . : 0D-1A-1C-BA-FA-0C,
                    DHCP Enabled . . . . . . . . . . . . . . . . : Yes,
                    Autoconfiguration Enabled . . . . . : Yes,
                    IPv6 Address. . . . . . . . . . . . . . . . . . : fd1a:b211:4323:0:73fb:4270:4f0d:8f31,
                    Temporary IPv6 Address. . . . . . . . : fd1a:b321:4412:1:c2f4:44ab:2fe4:a772,
                    Link-local IPv6 Address . . . . . . . . : fe70::42af:2143:3b1a:5b33%6,
                    IPv4 Address. . . . . . . . . . . . . . . . . . : 192.168.1.100,
                    Subnet Mask . . . . . . . . . . . . . . . . . : 255.255.255.0,
                    Lease Obainted. . . . . . .  . . . . . . . . : 2020-03-03 08:14:00,
                    Lease Expires . . . . . . . . . . . . . . . . : 2020-03-03 22:22:22,
                    Default Gateway . . . . . . . . . . . . . . : 192.168.1.1,
                    DHCP Server . . . . . . . . . . . . . . . . . : 192.168.1.1,
                    DHCPv6 IAID . . . . . . . . . . . . . . . . . : 317237474,
                    DHCPv6 Client DUID . . . . . . . . . : 00-01-02-03-04-05-06-07-08-09-10-AB,
                    DNS servers . . . . . . . . . . . . . . . . . : 192.168.1.1`);
        
                terminalText('');
            } else {
                terminalText(`Ethernet adapter Ethernet: <br/>,
                    Connection-specific DNS Suffix  . : lan,
                    IPv6 Address. . . . . . . . . . . . . . . . . . : fd1a:b211:4323:0:73fb:4270:4f0d:8f31,
                    Temporary IPv6 Address. . . . . . . . : fd1a:b321:4412:1:c2f4:44ab:2fe4:a772,
                    Link-local IPv6 Address . . . . . . . . : fe70::42af:2143:3b1a:5b33%6,
                    IPv4 Address. . . . . . . . . . . . . . . . . . : 192.168.1.100,
                    Subnet Mask . . . . . . . . . . . . . . . . . : 255.255.255.0,
                    Default Gateway . . . . . . . . . . . . . . : 192.168.1.1`);
        
                terminalText('');
            }
            break;
        case 'ping':
            let ip = cmd[1];
            if ( ip ) {
                let time = [getRandomInt(60, 14), getRandomInt(60, 14), getRandomInt(60, 14), getRandomInt(60, 14)];
                terminalText(`Pinging ${ip} with 32 bytes of data:`);
    
                setTimeout(function () {
                    terminalText(`Reply from ${ip}: bytes=32 time=${time[0]}ms TTL=57`);
                    setTimeout(function () {
                        terminalText(`Reply from ${ip}: bytes=32 time=${time[1]}ms TTL=57`);
                        setTimeout(function () {
                            terminalText(`Reply from ${ip}: bytes=32 time=${time[2]}ms TTL=57`);
                            setTimeout(function () {
                                terminalText(`Reply from ${ip}: bytes=32 time=${time[3]}ms TTL=57<br/>`);
                                terminalText(`Ping statistics for ${ip}:, ` +
                                    `<span>Packets: Sent = 4. Received = 4. Lost = 0 (0% loss)</span>, ` +
                                    `Approximate round trip times in milli-seconds:, ` +
                                    `<span>Minimum = ${Math.min(...time)}ms. Maximum = ${Math.max(...time)}ms. Average = ${Math.round(time.reduce((a, b) => a + b, 0) / time.length)}ms</span>`);
                                    terminalText('');
                            }, 700);
                        }, 700);
                    }, 700);
                }, 700);
            } else {
                wrongCommand();
            }
            break;
        case 'clear':
            $('#t-text').empty();
            break;
        case 'help':
        case 'cmdlist':
        case 'commands':
            terminalText(`Command list:, 
                <span>clear</span>,
                <span>ipconfig</span>,
                <span>ping [ip]</span>`);
                terminalText('');
            break;
        default:
            terminalText('Command not found.. Use /help');
    }
}

$('#t-input span').text(`C:\\Users\\${ loggedInUser.username }>`);

$('.program-terminal').click(() => {
    $('#t-input input').focus();
});

$('#t-input').submit(() => {
    if ( $('#t-input input').val().length > 0 ) {
        terminalCmd( $('#t-input input').val().toLowerCase() );
        $('#t-input input').val('');
    }
  
    return false;
});