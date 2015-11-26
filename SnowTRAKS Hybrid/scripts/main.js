

document.addEventListener("deviceready", onDeviceReady, false);
 
function id(element) {
    return document.getElementById(element);
}

function onDeviceReady() {
	cameraApp = new cameraApp();
    cameraApp.run();
    
    geolocationApp = new geolocationApp();
	geolocationApp.run();    

    navigator.splashscreen.hide();
}


function geolocationApp() {
}

geolocationApp.prototype = {
	_watchID:null,
    
	run:function() {
		var that = this;
		document.getElementById("watchButton").addEventListener("click", function() {
			that._handleWatch.apply(that, arguments);
		}, false);
		document.getElementById("refreshButton").addEventListener("click", function() {
			that._handleRefresh.apply(that, arguments);
		}, false);
	},
    
	_handleRefresh:function() {
        var options = {
            	enableHighAccuracy: true
            },
            that = this;
        
        that._setResults("Waiting for geolocation information...");
        
		navigator.geolocation.getCurrentPosition(function() {
			that._onSuccess.apply(that, arguments);
		}, function() {
			that._onError.apply(that, arguments);
		}, options);
	},
    
	_handleWatch:function() {
		var that = this,
		// If watch is running, clear it now. Otherwise, start it.
		button = document.getElementById("watchButton");
                     
		if (that._watchID != null) {
			that._setResults();
			navigator.geolocation.clearWatch(that._watchID);
			that._watchID = null;
                         
			button.innerHTML = "Start Geolocation Watch";
		}
		else {
			that._setResults("Waiting for geolocation information...");
			// Update the watch every second.
			var options = {
				frequency: 1000,
				enableHighAccuracy: true
			};
			that._watchID = navigator.geolocation.watchPosition(function() {
				that._onSuccess.apply(that, arguments);
			}, function() {
				that._onError.apply(that, arguments);
			}, options);
			button.innerHTML = "Clear Geolocation Watch";
            
		}
	},
    
	_onSuccess:function(position) {
		// Successfully retrieved the geolocation information. Display it all.
        
		this._setResults('Latitude: ' + position.coords.latitude + '<br />' +
						 'Longitude: ' + position.coords.longitude + '<br />' +
						 'Altitude: ' + position.coords.altitude + '<br />' +
						 'Accuracy: ' + position.coords.accuracy + '<br />' +
						 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
						 'Heading: ' + position.coords.heading + '<br />' +
						 'Speed: ' + position.coords.speed + '<br />' +
						 'Timestamp: ' + new Date(position.timestamp).toLocaleTimeString().split(" ")[0] + '<br />');
	},
    
	_onError:function(error) {
		this._setResults('code: ' + error.code + '<br/>' +
						 'message: ' + error.message + '<br/>');
	},
    
	_setResults:function(value) {
		if (!value) {
			document.getElementById("results").innerHTML = "";
		}
		else {
			document.getElementById("results").innerHTML = value;
		}
	},
}




function cameraApp(){}

cameraApp.prototype={
    _pictureSource: null,
    
    _destinationType: null,
    
    run: function(){
        var that=this;
	    that._pictureSource = navigator.camera.PictureSourceType;
	    that._destinationType = navigator.camera.DestinationType;
	    id("capturePhotoButton").addEventListener("click", function(){
            that._capturePhoto.apply(that,arguments);
        });
	    id("capturePhotoEditButton").addEventListener("click", function(){
            that._capturePhotoEdit.apply(that,arguments)
        });
	    id("getPhotoFromLibraryButton").addEventListener("click", function(){
            that._getPhotoFromLibrary.apply(that,arguments)
        });
	    id("getPhotoFromAlbumButton").addEventListener("click", function(){
            that._getPhotoFromAlbum.apply(that,arguments);
        });
    },
    
    _capturePhoto: function() {
        var that = this;
        
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        },function(){
            that._onFail.apply(that,arguments);
        },{
            quality: 50,
            destinationType: that._destinationType.DATA_URL
        });
    },
    
    _capturePhotoEdit: function() {
        var that = this;
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string. 
        // The allowEdit property has no effect on Android devices.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        }, function(){
            that._onFail.apply(that,arguments);
        }, {
            quality: 20, allowEdit: true,
            destinationType: cameraApp._destinationType.DATA_URL
        });
    },
    
    _getPhotoFromLibrary: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.PHOTOLIBRARY);         
    },
    
    _getPhotoFromAlbum: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },
    
    _getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function(){
            that._onPhotoURISuccess.apply(that,arguments);
        }, function(){
            cameraApp._onFail.apply(that,arguments);
        }, {
            quality: 50,
            destinationType: cameraApp._destinationType.FILE_URI,
            sourceType: source
        });
    },
    
    _onPhotoDataSuccess: function(imageData) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
    
        // Show the captured photo.
        smallImage.src = "data:image/jpeg;base64," + imageData;
    },
    
    _onPhotoURISuccess: function(imageURI) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
         
        // Show the captured photo.
        smallImage.src = imageURI;
    },
    
    _onFail: function(message) {
        alert(message);
    }
}