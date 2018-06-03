class sdtdMap {
    constructor(mapElement, server) {
        this.mapElement = mapElement;
        this.playerMarkerMap = new Map();
        this.server = server;
        this.playerPath = undefined;
        this.map = this.initMap();
    }

    drawPlayers(players, trackingInfo) {
        let server = window.SAILS_LOCALS.server;

        this.playerMarkerMap.forEach(existingMarker => {
            existingMarker.remove()
        })

        this.playerMarkerMap.clear();
        if (this.playerPath) {
            this.playerPath.remove();
        }


        for (const player of players) {
            let playerLatLng = L.latLng(L.latLng(player.positionX, player.positionZ));

            let marker = L.marker(playerLatLng, {
                title: player.name,
                alt: player.name,
            });
            let popup = L.popup().setContent(`<a href="/player/${player.id}/profile">${player.name}</a>`);

            marker.bindPopup(popup)

            marker.addTo(this.map)

            this.playerMarkerMap.set(player.id, marker);

        }

        if (trackingInfo) {
            if (trackingInfo.length > 0) {
                var playerPath = new Array();

                for (const record of trackingInfo) {
                    if (record.x && record.z) {
                        playerPath.push([record.x, record.z])
                    }
                }

                this.playerPath = L.polyline(playerPath, { color: 'red' }).addTo(this.map);

            }
        }

    }

    initMap() {

        var mapinfo = {
            regionsize: 512,
            chunksize: 16,
            tilesize: 128,
            maxzoom: 4
        }

        let SDTD_Projection = {
            project: function (latlng) {
                return new L.Point(
                    (latlng.lat) / Math.pow(2, mapinfo.maxzoom),
                    (latlng.lng) / Math.pow(2, mapinfo.maxzoom));
            },

            unproject: function (point) {
                return new L.LatLng(
                    point.x * Math.pow(2, mapinfo.maxzoom),
                    point.y * Math.pow(2, mapinfo.maxzoom));
            }
        };


        let SDTD_CRS = L.extend({}, L.CRS.Simple, {
            projection: SDTD_Projection,
            transformation: new L.Transformation(1, 0, -1, 0),

            scale: function (zoom) {
                return Math.pow(2, zoom);
            }
        });

        var mymap = L.map('sdtdMap', {
            attributionControl: false,
            crs: SDTD_CRS
        }).setView([0, 0], Math.max(0, mapinfo.maxzoom - 5));

        var initTime = new Date().getTime();
        var tileLayer = this.GetSdtdTileLayer(mapinfo, initTime);

        tileLayer.addTo(mymap)

        //drawPlayerMarkers(mymap);

        return mymap
    }

    GetSdtdTileLayer(mapinfo, initTime, isMiniMap) {
        if (typeof isMiniMap == 'undefined') isMiniMap = false;

        var tileLayer = L.tileLayer(`http://${server.ip}:${server.webPort}/map/{z}/{x}/{y}.png?adminuser={adminuser}&admintoken={admintoken}`, {
            maxZoom: mapinfo.maxzoom + 1,
            minZoom: Math.max(0, mapinfo.maxzoom - 5),
            maxNativeZoom: mapinfo.maxzoom,
            minNativeZoom: 0,
            tileSize: mapinfo.tilesize,
            adminuser: `${server.authName}`,
            admintoken: `${server.authToken}`
        })


        tileLayer.getTileUrl = function (coords) {
            coords.y = (-coords.y) - 1;
            return L.TileLayer.prototype.getTileUrl.bind(tileLayer)(coords);
        };


        return tileLayer;
    }

    drawPlayerMarkers(player, trackingInfo) {

        let server = window.SAILS_LOCALS.server;

        let onlyOnline = $("#map-players-online-check").prop('checked');

        $.get('/api/sdtdserver/players', { serverId: server.id, onlyOnline: onlyOnline, staticOnly: !onlyOnline }, data => {
            playerMarkerMap.forEach(existingMarker => {
                existingMarker.remove()
            })

            playerMarkerMap.clear();


            for (const player of data) {

                let playerLatLng = L.latLng(L.latLng(player.positionX, player.positionZ));
                if (_.isUndefined(playerMarkerMap.get(player.id))) {

                    let marker = L.marker(playerLatLng, {
                        title: player.name,
                        alt: player.name,
                    });
                    let popup = L.popup().setContent(`<a href="/player/${player.id}/profile">${player.name}</a>`);

                    marker.bindPopup(popup)

                    marker.addTo(map)

                    playerMarkerMap.set(player.id, marker);
                }
            }
        })
    }

    deletePlayerMarkers() {
        playerMarkerMap.forEach(existingMarker => {
            existingMarker.remove()
        })

        playerMarkerMap.clear();
    }


}

