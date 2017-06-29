var signedIn = false;

export function LoadGoogleAPI() {
	window.gapi.load('client:auth2', function() {
		window.gapi.auth2.init({
			discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
			clientId: '649545190512-qi80ml37nptf8pvf8kne34gbhqpn0u7b.apps.googleusercontent.com',
			scope: 'https://www.googleapis.com/auth/calendar'
		}).then(function() {
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
			updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		});
	});
}

export function HandleGoogleAuth() {
	window.gapi.auth2.getAuthInstance().signIn();
}

export function GoogleSignedIn() {
	return signedIn;
}

function updateSigninStatus(isSignedIn) {
	signedIn = isSignedIn;
}
