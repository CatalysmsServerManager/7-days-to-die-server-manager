class sdtdMap {
    constructor(mapElement, server) {
        this.mapElement = mapElement;
        this.playerMarkerMap = new Map();
        this.server = server;
        this.playerPathsMap = new Map();
        this.circles = new Array();
        this.rectangles = new Array()
        this.layerGroup = L.layerGroup()
        this.map = this.initMap();
    }

    clear() {

        this.layerGroup.clearLayers();

    }

    deletePlayerMarkers() {
        this.playerMarkerMap.forEach(existingMarker => {
            existingMarker.remove()
        })

        playerMarkerMap.clear();
    }

    drawCircle(x, z, radius, extraOptions) {
        circle = L.circle([x, z], { radius: radius });
        circle.addTo(this.layerGroup);
        this.circles.push(circle)
        return circle

    }

    // Radius a bit of a misnomer here 
    drawRectangle(x, z, radius, extraOptions) {
        rectangle = L.rectangle([[x - radius, z - radius], [x + radius, z + radius]]);
        rectangle.addTo(this.layerGroup)
        this.rectangles.push(rectangle)
        return rectangle
    }


    drawPlayers(players, trackingInfo) {

        for (const player of players) {
            let playerLatLng = L.latLng(player.positionX, player.positionZ);

            let marker = L.marker(playerLatLng, {
                title: player.name,
                alt: player.name,
            });
            let popup = L.popup().setContent(`<a href="/player/${player.id}/profile">${player.name}</a>`);

            marker.bindPopup(popup)

            this.playerMarkerMap.set(player.id, marker);

        }

        if (trackingInfo) {
            if (trackingInfo.length > 0) {

                let playerPathArrays = new Map();

                for (const record of trackingInfo) {
                    if (!_.isUndefined(record.x) && !_.isUndefined(record.z)) {

                        let currentSet = playerPathArrays.get(record.player);
                        if (!currentSet) {
                            currentSet = new Array();
                        }
                        currentSet.push([record.x, record.z])
                        playerPathArrays.set(record.player, currentSet);
                    }
                }

                let colors = ['red', 'green', 'blue', 'yellow', 'orange', 'brown'];
                let colorIterator = 0;

                playerPathArrays.forEach((playerPath, playerId) => {

                    if (!colors[colorIterator]) {
                        colorIterator = 0;
                    }

                    let playerPathPoly = L.polyline(playerPath, { color: colors[colorIterator] });
                    colorIterator++

                    this.playerPathsMap.set(playerId, playerPathPoly);

                    let playerMarker = this.playerMarkerMap.get(playerId);
                    playerMarker.setLatLng(playerPath[playerPath.length - 1]);
                });



            }
        }

        this.playerMarkerMap.forEach(marker => {
            marker.addTo(this.layerGroup)
        })

        this.playerPathsMap.forEach(path => {
            path.addTo(this.layerGroup)
        })

    }

    drawLandClaims(landClaims, players) {
        console.log(landClaims);
        for (const claimOwner of landClaims.claimowners) {
            let playerThatOwnsClaim = players.filter(player => claimOwner.steamid === player.steamId);

            for (const claimToDraw of claimOwner.claims) {

                let marker = L.marker([claimToDraw.x, claimToDraw.z], {
                    title: playerThatOwnsClaim[0].name,
                    alt: playerThatOwnsClaim[0].name,
                });
                let popup = L.popup().setContent(`Claim by ${playerThatOwnsClaim[0].name}`);
    
                marker.bindPopup(popup);

                marker.addTo(this.layerGroup);
                
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
        this.layerGroup.addTo(mymap)

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

}

