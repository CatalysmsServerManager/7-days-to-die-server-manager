var $$ = Dom7;

function drawUserServers(userId) {

    $$.get('/api/user/ownedServers', { userId: userId }, function success(data, status, xhr) {
        let servers = JSON.parse(data)
        _.each(servers, function(server) {
            $$('.user-servers')
                .append(createServerEntry(server));
        });
    }, function error(xhr, status) {
        console.log(status)
    })



    function createServerEntry(server) {
        var dashboardlink = "/sdtdserver/" + server.id + "/dashboard"
        let html = `<a href=${dashboardlink} class="item-link">
     <li class="item-content">
    <div class="item-inner">
        <div class="item-title">
            ${server.ip}
        </div>
        <div class="item-after">Label</div>
    </div>
</li>
</a>`;
        return html;
    }



}

function addServer() {
    let serverip = $$('#input-serverip').val();
    let telnetport = $$('#input-telnetport').val();
    let telnetpassword = $$('#input-telnetpassword').val();
    let webport = $$('#input-webport').val();
    $$.post('/api/sdtdserver/addserver', {
        serverip: serverip,
        telnetport: telnetport,
        telnetpassword: telnetpassword,
        webport: webport
    }, function(data) {
        let response = JSON.parse(data);
        window.location.replace(`/sdtdserver/${response.id}/dashboard`);
    });
}