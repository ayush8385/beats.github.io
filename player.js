function showPlay(){
    document.getElementsByClassName('play_button')[0].style.visibility='visible';
    
}
function hidePlay(){
    document.getElementsByClassName('play_button')[0].style.visibility = 'hidden';
}

function openQueue(){
    if(document.getElementById('queue_dropmenu').style.visibility=='visible'){
        document.getElementById('queue_dropmenu').style.visibility='hidden';
    }
    else{
        document.getElementById('queue_dropmenu').style.visibility='visible';
    }
}


function myFunction() {
    document.getElementsByClassName('container')[0].classList.toggle("change");
    if(document.getElementsByClassName('mobile_nav')[0].style.visibility == 'visible'){
        document.getElementsByClassName('mobile_nav')[0].style.visibility = 'hidden';
        const element = document.querySelector('.mobile_nav');
        element.classList.remove('animate__animated', 'animate__bounceIn');
        
    }
    else{
        document.getElementsByClassName('mobile_nav')[0].style.visibility = 'visible'
        const element = document.querySelector('.mobile_nav');
        element.classList.add('animate__animated', 'animate__bounceIn');
    }
}

function queue(x) {
    var right = $("#main_queue");
    if(right.css('display')=='none'){
        x.classList.toggle("fa-angle-down");

        right.css({'display':'block','width':'100%','position':'absolute','background-color':'black'});
        right.addClass('animateQueueBtoT');
        right.removeClass('animateQueueTtoB');
    }
    else{
        x.classList.toggle("fa-angle-up");

        right.addClass('animateQueueTtoB');
        right.removeClass('animateQueueBtoT');
        
        setTimeout(function(){
            right.css({'display':'none','width':'0%','position':'relative'});
        },500)
 
    }
}


function loadData(){
    var artist_id = localStorage.getItem('artist_id');
    var ARTIST='https://api.spotify.com/v1/artists/'+artist_id;
    callApi("GET",ARTIST,null,handleArtistResponse);

    loadTopTracks(artist_id);
}

function loadTopTracks(artist_id){
    var ARTIST_TRACKS ='https://api.spotify.com/v1/artists/'+artist_id+'/top-tracks?market=ES';
    callApi("GET",ARTIST_TRACKS,null,handleArtistTracksResponse);
}

function callApi(method,url,body,callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method,url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization','Bearer '+localStorage.getItem('access_token'));
    xhr.send(body);
    xhr.onload=callback;

}

function handleArtistResponse(){
    if(this.status==200){
        var data = JSON.parse(this.responseText);
        $('.artist_details').append('<img src="' + data.images[0].url + '">');

        var play = $('<input/>', { type: "button", id: "play", value: "Play All" });
        var follow = $('<input/>', { type: "button", id: "follow", value: "Follow" });
        var artist_abt = $('<div/>').addClass('artist_about').append($('<p/>').attr('id','title').text(data.name)).append($('<div/>').attr('id','buttons').append(play).append(follow));
        $('.artist_details').append(artist_abt);
        $('.artist_about').append($('<p/>').text(data.followers.total+' Followers ').css({'margin-top':'20px','color':'lightgray'}));
    }
    else if(this.status==401){
        refreshAccessToken();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function handleArtistTracksResponse(){
    if(this.status==200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        // $('.artist_details').append('<img src="' + data.images[0].url + '">');

        // var play = $('<input/>', { type: "button", id: "play", value: "Play All" });
        // var follow = $('<input/>', { type: "button", id: "follow", value: "Follow" });
        // var artist_abt = $('<div/>').addClass('artist_about').append($('<p/>').attr('id','title').text(data.name)).append($('<div/>').attr('id','buttons').append(play).append(follow));
        // $('.artist_details').append(artist_abt);
        // $('.artist_about').append($('<p/>').text(data.followers.total+' Followers ').css({'margin-top':'20px','color':'lightgray'}));
    }
    else if(this.status==401){
        refreshAccessToken();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}