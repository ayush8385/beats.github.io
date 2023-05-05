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
    var right = $("#main_right");
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

function loadPlayLists(){
    $('#main_left').css({'display':'none'});
    $('#player_view').css({'display':'none'});
    $('#main_right').css({'display':'block'});
    $('#player_main_right').css({'display':'none'});
    removeAllItems('playlist');
    $('#playlist').append($('<div/>').attr('id','playlists')).css({'display':'contents'});
    refreshPlaylists();
}


function gotoHome(){
    $('#main_left').css({'display':'block'});
    $('#playlist').css({'display':'none'});
    $('#player_view').css({'display':'none'});
    $('#main_right').css({'display':'block'});
    $('#player_main_right').css({'display':'none'});
}






var client_id = '72253b95f803465f8014adaed3585731';
var client_secret ='c1718e179b3a42d3af249d76710bd7ca';
var TOKEN ='https://accounts.spotify.com/api/token';

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";
var radioButtons = [];

function onPageLoad(){
    if(window.location.search.length>0){
        handleRedirect();
    }
    ///Added

    else{
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
        }
        else {
            refreshDevices();
            
            currentlyPlaying();
        }
    }
    refreshRadioButtons();


}

function handleRedirect(){
    let code =getCode();
    fetchAccessToken(code);
    window.history.pushState("","",'https://ayush8385.github.io/beats.github.io/');
}

function fetchAccessToken(code){

    client_id = '7b25cda4854e4c61b9562601819ebe2c';
    client_secret ='1fb76ef9e1404961b144ed7e36bf66ab';
    let url = 'grant_type=authorization_code';
    url+='&code='+code;
    url+='&redirect_uri='+encodeURI('https://ayush8385.github.io/beats.github.io/');
    url+='&client_id='+client_id;
    url+='&client_secret='+client_secret;

    callAuthApi(url);
}

function callAuthApi(url){
    let xhr = new XMLHttpRequest();
    xhr.open("POST",TOKEN,true);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization','Basic '+btoa(client_id+":"+client_secret));
    xhr.send(url);
    xhr.onload=handleAuthResponse;
}

function refreshAccessToken(){
    let url='grant_type=refresh_token';
    url+='&refresh_token='+localStorage.getItem('refresh_token');
    url+='&client_id='+client_id;
    callAuthApi(url);
}

function handleAuthResponse(){
    if(this.status==200){
        var data =JSON.parse(this.responseText);
        console.log(data);
        if(data.access_token!=undefined){
            access_token=data.access_token;
            localStorage.setItem('access_token',access_token);
        }
        if(data.refresh_token!=undefined){
            refresh_token=data.refresh_token;
            localStorage.setItem('refresh_token',refresh_token);

        }
        onPageLoad();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if(queryString.length>0){
        const urlParams = new URLSearchParams(queryString);
        code=urlParams.get('code');
    }

    return code;
}

function requestAuth(){
    let url = 'https://accounts.spotify.com/authorize'

    url+='?client_id='+client_id;
    url+='&response_type=code';
    url+='&redirect_uri='+encodeURI('https://ayush8385.github.io/beats.github.io/');
    url+='&show-dialogue=true';
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href=url;

}

var dev_menu=false
function deviceMenu(){
    refreshDevices();
    if(dev_menu){
        $('#device_dropdown').css('visibility','hidden');
        dev_menu=false;
    }
    else{
        $('#device_dropdown').css('visibility','visible');
        dev_menu=true;
    }
}

// Api Calls
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const SINGLE_PLAYLIST = "https://api.spotify.com/v1/playlists/"
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";
const SEEK = "https://api.spotify.com/v1/me/player/seek";
const VOLUME ="https://api.spotify.com/v1/me/player/volume";
const ARTIST = "https://api.spotify.com/v1/artists/";
const RELATED_ARTIST = "https://api.spotify.com/v1/artists/{id}/related-artists";
const ARTIST_TOP ='https://api.spotify.com/v1/artists/{id}/top-tracks';





function refreshDevices(){
    callApi( "GET", DEVICES, null, handleDevicesResponse );
}

function handleDevicesResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems( "device_dropdown" );
        data.devices.forEach(item => addDevice(item));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addDevice(item){
    let node =$("<p/>").attr('data-id',item.id).text(item.name);
    $("#device_dropdown").append(node); 
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}






function refreshPlaylists(){
    callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems( "playlists" );
        for(var i=0;i<data.items.length;i++){
            addPlaylist(data,i);
        }
        document.getElementById('playlists').value=currentPlaylist;

    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addPlaylist(data,index){
    var item = data.items[index];
    var img = $('<img>');
    img.attr('src', item.images[0].url);
    img.attr('width', '100%');

    let playlistImage = $('<div/>').addClass('playlist_img').append($('<i/>').attr('id','play_btn').attr("class", "fa fa-play"))
    playlistImage.append(img);
    let node = $('<div/>').addClass('playlist_box').append(playlistImage).attr('id','playlist_item-'+index).attr('data-id',item.id);
    let details =$("<div/>").addClass('playlist_details').append($('<p/>').text(item.name)).append($('<p/>').css({'font-size':'14px','color':'lightgray'}).text(item.tracks.total+' Songs'));
    node.append(details);

    $("#playlists").append(node);
    
    $('#playlist_item-'+index).on('click',loadPlaylistTracks);
}

function loadPlaylistTracks(){

    
    $('#main_left').css({'display':'none'});
    $('#playlist').css({'display':'none'});
    $('#player_view').css({'display':'block','width':'65%'})
    $('#main_right').css({'display':'none'});
    $('#player_main_right').css({'display':'block','width':'35%'})

   let playlist_id = $(this).attr('data-id');
   setUpPlaylistView(playlist_id);
   fetchTracks(playlist_id);
}

function setUpPlaylistView(playlistId){
    callApi( "GET", SINGLE_PLAYLIST+playlistId, null, handleSetupPlayListResponse );
}


function handleSetupPlayListResponse(){
    if(this.status==200){
        var data = JSON.parse(this.responseText);
        var item = data;
        console.log(item);
        
        removeAllItems('top_details');
        
        var image = '<img src="' + item.images[0].url + '">';
        var play = $('<input/>', { type: "button", id: "playAll", value: "Play All"});
        var artist_abt = $('<div/>').attr('id','playlist_abt').append($('<p/>').attr('id','title').text(item.name));

        if(item.type=='playlist'){
            artist_abt.append($('<p/>').attr('id','tracks_cnt').text(item.tracks.total+' Tracks')).append(play);
        }
        if(item.type=='artist'){
            var follow = $('<input/>', { type: "button", id: "follow", value: "Follow"}).css('margin-left','16px');
            artist_abt.append($('<p/>').attr('id','tracks_cnt').text(item.followers.total+' Followers')).append(play).append(follow);
        }

        
        
        $('#top_details').append(image).append(artist_abt);
        
        document.getElementById('playAll').onclick = () => shuffle();
        
    }
    else if(this.status==401){
        refreshAccessToken();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}




function play(index){
    
  //  let album = document.getElementById("album").value;
    let body = {};
    // if ( album.length > 0 ){
    //     body.context_uri = album;
    // }
    // else{
        
   // }
   var type = localStorage.getItem('uri_type');

    if(type=='playlist'){
        
        body.context_uri = "spotify:"+type+":" + localStorage.getItem('uri');
        body.offset = {};
        body.offset.position = index ;
        body.position_ms = 0;
    }
    else{
        body.uris=["spotify:"+type+":" + localStorage.getItem('uri')];
    }
    
    callApi( "PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
}

function shuffle(){
    callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId(), null, handleApiResponse );
    play(0);
}

function pause(){
    callApi( "PUT", PAUSE + "?device_id=" + deviceId(), null, handleApiResponse );
}

function next(){
    callApi( "POST", NEXT + "?device_id=" + deviceId(), null, handleApiResponse );
}

function previous(){
    callApi( "POST", PREVIOUS + "?device_id=" + deviceId(), null, handleApiResponse );
}

function transfer(){
    let body = {};
    body.device_ids = [];
    body.device_ids.push(deviceId())
    callApi( "PUT", PLAYER, JSON.stringify(body), handleApiResponse );
}

function handleApiResponse(){
    if ( this.status == 200){
        console.log(this.responseText);
        currentlyPlaying();
    }
    else if ( this.status == 204 ){
        
        currentlyPlaying();
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}

function deviceId(){
    let select_device= $("#device_dropdown p").eq(0).attr('data-id');
    return select_device;

}

function fetchTracks(playlist_id){
    //let playlist_id = $("#queues p").eq(0).attr('data-id');
    if ( playlist_id.length > 0 ){
        url = TRACKS.replace("{{PlaylistId}}", playlist_id);
        localStorage.setItem('uri',playlist_id);
        localStorage.setItem('uri_type','playlist');
        callApi( "GET", url, null, handleTracksResponse );
    }else{
        console.log('Empty playlsit while fetching tracks');
    }
}

function handleTracksResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
    
        removeAllItems('top_tracks');
        for(var i=0;i<data.items.length;i++){
            addTrack(data.items[i].track,i);
        }

        fetchSimilarArtist(data.items[0].track.artists[0].id);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function fetchSimilarArtist(artist_id){
    var url = RELATED_ARTIST.replace("{id}",artist_id);
    callApi('GET',url,null,handelRelatedArtistResponse);
}

function  handelRelatedArtistResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
    
        removeAllItems('similar_box');

        for(var i=0;i<data.artists.length;i++){
            addSimilarArtist(data.artists[i],i);
        }
        
    }
    else if ( this.status == 401 ){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addSimilarArtist(item,index){
    var image = $('<div/>').append($('<img>').attr('src',item.images[0].url).css({'width':'100px','border-radius':'14px','height':'100px'}));
    var name = $('<div/>').css({'margin-left':'5px','max-width':'100px'}).append($('<p/>').text(item.name).css({'font-size':'13px'})).append($('<p/>').text(item.followers.total+' Followers').css({'font-size':'11px','color': 'rgb(197, 196, 196)'}));

    var artist_box = $('<div/>').attr('src','artist_music').attr('data-id',item.id).attr('id','artist-item-'+index).css({'margin':'10px',"padding":"0"}).append(image).append(name);

    $('#similar_box').append(artist_box);


    $('#artist-item-'+index).on('click',function(){
        var artist_id = $(this).attr('data-id');
        updateTopView(artist_id);
        fetchSimilarArtist(artist_id);
        updateTracks(artist_id);
        
    })
}

function updateTopView(artist_id){
    callApi("GET",ARTIST+artist_id,null,handleSetupPlayListResponse)
}

function updateTracks(artist_id){
    var url = ARTIST_TOP.replace("{id}",artist_id);
    callApi('GET',url+'?market=IN',null,handleArtistTracksResponse);
}


function handleArtistTracksResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
    
        removeAllItems('top_tracks');
        for(var i=0;i<data.tracks.length;i++){
            addTrack(data.tracks[i],i);
        }
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}


function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

var track_progress = null;


function addTrack(item, index){

    console.log(item);
    let indexing = $('<p/>').css('font-size','13px').text(index+1);

    let song_image = $('<img>').css('margin-left','20px').attr('src',item.album.images[0].url);

    let song_name = $('<p/>').css({'font-size':'16px','color':'rgb(214, 214, 214)'}).text(item.name);
    let artist_name = $('<p/>').css({'font-size':'13px','color':'rgb(168, 164, 164)'}).text(item.artists[0].name);
    let song_detail = $('<div/>').css('margin-left','16px').append(song_name).append(artist_name);


    let track_left = $('<div/>').css({'display':'flex','align-items':'center','width':'400px'}).attr('id','queue_song_img').append(indexing).append(song_image).append(song_detail);

    let duration = $('<div/>').css({'display':'flex','align-items':'center'}).append($('<p/>').css({'font-size':'13px','color':'rgb(198, 194, 194)'}).text(millisToMinutesAndSeconds(item.duration_ms)));


    let track_right = $('<div/>').attr('id','queue_fav').css('margin-right','20px').append($('<i/>').css({'color':'rgb(189,188,188'}).attr("class", "fa fa-heart-o")).append($('<i/>').css({'color':'rgb(189,188,188','margin-left':'18px'}).attr("class", "fa fa-plus"));


    let node =$("<div/>").attr('data-id',item.id).attr('data-artistid',item.artists[0].id).addClass('artist_music').attr('id','track_item-'+index).append(track_left).append(duration).append(track_right);
    $("#top_tracks").append(node);


    $('#track_item-'+index).on('click',function(){
        localStorage.setItem('uri',$(this).attr('data-id'));
        localStorage.setItem('uri_type','track')
        play(index);
        if(track_progress!=null){
            clearInterval(track_progress);
        }
        fetchSimilarArtist($(this).attr('data-artistid'));
    });

}

function currentlyPlaying(){
    callApi( "GET", PLAYER + "?market=US", null, handleCurrentlyPlayingResponse );
}

function handleCurrentlyPlayingResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if ( data.item != null ){
            setUpPlayer(data.item);

            controlProgress(data.item);

            console.log(data.item);
        }


        if ( data.device != null ){
            // select device
            currentDevice = data.device.id;
            //document.getElementById('devices').value=currentDevice;
            console.log(data.device);
        }

        if ( data.context != null ){
            // select playlist
            currentPlaylist = data.context.uri;
            currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
            document.getElementById('playlists').value=currentPlaylist;
            console.log(currentPlaylist);
        }
    }
    else if ( this.status == 204 ){

    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

var start_time=0;
var end_time=0;
function controlProgress(item){
            start_time = 0;
            end_time = item.duration_ms;
            let w=0;
            track_progress = setInterval(function(){
                removeAllItems('start_time');
                $('#start_time').append($('<p/>').text(millisToMinutesAndSeconds(start_time)));
                $('#bar_inside').css('width',w+'%');
                $('#bar_point').css('left',w-1+'%');
                start_time+=1000;
                w=(start_time/end_time)*100;
                if(start_time>end_time){
                    clearInterval(track_progress);
                    removeAllItems('play_pause');
                    $('#play_pause').append($('<i/>').css({'color':'whitesmoke','font-size':'38px','margin-top':'-9px'}).attr("class", "fa fa-play-circle-o")).attr('data-mode','paused');
                }
                
            },1000);
}


$('#bar').on('click',function(e){
    // var posX = $(this).offset().left;
    // var posY = $(this).offset().top;
    // console.log("e.pageX: " + e.pageX + " posX:" + posX + " e.pageY:" + e.pageY + " posY:" + posY);
    
    var point = document.getElementById('bar_point');
    var inside = document.getElementById('bar_inside');

    var offsetX=$('#bar').offset().left;
    var spotX = e.pageX - offsetX;

    var barWidth = (40*document.documentElement.clientWidth)/100;
    var seek_bar_percent = (spotX/barWidth)*100;
    
    start_time = (end_time*seek_bar_percent)/100;
    
    // point.style.left = spotX-2 + 'px';
    // inside.style.width=spotX+'px';

    callApi("PUT",SEEK+'?position_ms='+Math.floor(start_time)+'&device_id='+deviceId(),null,handleSeekResponse);

    
});

function handleSeekResponse(){
    if(this.status==200){

    }
    else if(this.status==204){
        // var data = JSON.parse(this.responseText);
        // console.log(data);
       
    }
    else if ( this.status == 401 ){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
    
}

$('#volume_bar').on('click',function(e){
   
    var point = document.getElementById('vol_point');
    var inside = document.getElementById('vol_inside');

    var offsetX=$('#volume_bar').offset().left;
    var spotX = e.pageX - offsetX;

    var barWidth = (8*document.documentElement.clientWidth)/100;
    var seek_bar_percent = (spotX/barWidth)*100;
    
    $('#vol_inside').css('width',seek_bar_percent+'%');
    $('#vol_point').css('left',seek_bar_percent-1+'%');
    
    // point.style.left = spotX-2 + 'px';
    // inside.style.width=spotX+'px';

    callApi("PUT",VOLUME+'?volume_percent='+Math.floor(seek_bar_percent)+'&device_id='+deviceId(),null,handleVolumeResponse);

    
});

function handleVolumeResponse(){
    console.log(this.status);
}



$('#play_pause').on('click',function(){
    if($('#play_pause').attr('data-mode')=='paused'){
        play();
        removeAllItems('play_pause');
        $('#play_pause').append($('<i/>').css({'color':'whitesmoke','font-size':'38px','margin-top':'-9px'}).attr("class", "fa fa-pause-circle-o")).attr('data-mode','playing');

    }
    else{
        pause();
        removeAllItems('play_pause');
        $('#play_pause').append($('<i/>').css({'color':'whitesmoke','font-size':'38px','margin-top':'-9px'}).attr("class", "fa fa-play-circle-o")).attr('data-mode','paused');
    }
});


function setUpPlayer(item){
    removeAllItems('artist_image')
    removeAllItems('player_song_name');
    removeAllItems('player_artist_name');
   
    removeAllItems('end_time');
    
    $('#artist_image').append($('<img>').attr('src',item.album.images[2].url));
    $('#player_song_name').append($('<p/>').text(item.name));
    $('#player_artist_name').append($("<p/>").text(item.artists[0].name));

    
    $('#end_time').append($('<p/>').text(millisToMinutesAndSeconds(item.duration_ms)));

    removeAllItems('play_pause');
    $('#play_pause').append($('<i/>').css({'color':'whitesmoke','font-size':'38px','margin-top':'-9px'}).attr("class", "fa fa-pause-circle-o")).attr('data-mode','playing');

}


function saveNewRadioButton(){
    let item = {};
    item.deviceId = deviceId();
    item.playlistId = document.getElementById("playlists").value;
    radioButtons.push(item);
    localStorage.setItem("radio_button", JSON.stringify(radioButtons));
    refreshRadioButtons();
}

function refreshRadioButtons(){
    let data = localStorage.getItem("radio_button");
    if ( data != null){
        radioButtons = JSON.parse(data);
        if ( Array.isArray(radioButtons) ){
            removeAllItems("radioButtons");
            radioButtons.forEach( (item, index) => addRadioButton(item, index));
        }
    }
}

function onRadioButton( deviceId, playlistId ){
    let body = {};
    body.context_uri = "spotify:playlist:" + playlistId;
    body.offset = {};
    body.offset.position = 0;
    body.offset.position_ms = 0;
    callApi( "PUT", PLAY + "?device_id=" + deviceId, JSON.stringify(body), handleApiResponse );
    //callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId, null, handleApiResponse );
}

function addRadioButton(item, index){
    let node = document.createElement("button");
    node.className = "btn btn-primary m-2";
    node.innerText = index;
    node.onclick = function() { onRadioButton( item.deviceId, item.playlistId ) };
    document.getElementById("radioButtons").appendChild(node);
}


function removeAllItems( elementId ){
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
