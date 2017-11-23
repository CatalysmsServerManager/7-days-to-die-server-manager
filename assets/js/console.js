var $$ = Dom7;

function startConsole(serverID) {
    console.log("Starting console for server with id " + serverID);

    io.socket.get('/sdtdserver/' + serverID + '/subscribetosocket', function(response) {
        console.log("Subscribed to socket " + response);
    });

    io.socket.on('logLine', function(logLine) {
        $$('.console-window').append('<li class=\"log-line\">' + logLine.msg + '</li>');
        scrollToBottom();
    });
}

function scrollToBottom() {
    $$('.console-window').scrollTop($$('.console-window')[0].scrollHeight);
}