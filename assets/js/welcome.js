var $$ = Dom7;

function drawUserServers(userId) {
    let servers = serversOwnedByUser(userId)
    console.log(servers)

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

    _.each(servers, function(server) {
        console.log('Creating a server entry');
        $$('.user-servers')
            .append(createServerEntry(server));

    });
}