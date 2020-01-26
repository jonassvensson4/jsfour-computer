let randomTrending = {
    'Fivem': '13 tn tweets',
    'Jsfour': '1337 tn tweets',
    'Gtav': '304 tn tweets',
    'Fifa': '200 tn tweets',
    'Disney': '439 tn tweets',
    'Sunes Sommar': '3.2 tn tweets',
    'Phub': '700 tn tweets',
    'Fortnite': '11.3 tn tweets',
    'Steam': '8000 tweets',
    'Startrek': '4 tn tweets',
    'Discord': '380 tn tweets',
    'Twitch': '12 tn tweets',
    'Youtube': '24 tn tweets',
    'Sweden': '56 tn tweets',
    'Food': '70 tn tweets',
    'Game Of Thrones': '176 tn tweets',
    'John Wick': '12 tn tweets',
    'The Lion King': '8.3 tn tweets',
};

for (let i = 0; i < 4; i++) {
    let rnd = Object.keys(randomTrending)[Math.floor(Math.random() * Math.floor(Object.keys(randomTrending).length))];
   
    $('#twitter-dasboard-trending ul').append(`<li>
        <p>${rnd}</p>
        <p>${randomTrending[rnd]}</p>
    </li>`);
}

$('#twitter-dashboard-content p').text( loggedInUser.username );
$('#twitter-dashboard-content img').attr('src', loggedInUser.avatar);

fetch(`https://${ GetParentResourceName() }/jsfour-computer:tempData`, {
    method: 'POST',
    body: JSON.stringify({
        type: 'get',
        program: 'twitter'
    })
})
.then( response => response.text())
.then( data => {
    if ( data != 'null' ) {
        data = JSON.parse(data);

        Object.keys( data ).forEach(key => {
            let d = JSON.parse(data[key]);

            let toAppend = `<div class="twitter-post">
                <div class="twitter-post-header">
                    <img src="${ d.avatar }" draggable="false" />
                    <p>${ d.username } <span>@${ d.username }</span></p>
                </div>
                <p class="twitter-post-text">${ d.text }</p>
            </div>`;

            $('#twitter-posts').prepend( toAppend );
        });
    }
});

$('.program-twitter form').submit(() => {
    fetch(`https://${ GetParentResourceName() }/jsfour-computer:emitNet`, {
        method: 'POST',
        body: JSON.stringify({
            type: 'all',
            tempdata: true,
            data: {
                'program': 'twitter',
                'text': $('#twitter-textarea').val(),
                'username': loggedInUser.username,
                'avatar': loggedInUser.avatar
            }
        })
    });

    $('#twitter-textarea').val('');

    return false;
});

function toNUItwitter( data ) {
    let toAppend = `<div class="twitter-post">
        <div class="twitter-post-header">
            <img src="${ data.avatar }" draggable="false" />
            <p>${ data.username } <span>@${ data.username }</span></p>
        </div>
        <p class="twitter-post-text">${ data.text }</p>
    </div>`;

    $('#twitter-posts').prepend( toAppend );
}
