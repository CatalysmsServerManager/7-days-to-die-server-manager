const sevenDays = require('machinepack-7daystodiewebapi');

let detectedVersion

module.exports = {


    friendlyName: 'Set inventory tracking',


    description: '',


    inputs: {

        serverId: {
            type: 'number',
            custom: async (valueToCheck) => {
                let foundServer = await SdtdServer.findOne(valueToCheck);
                return foundServer
            },
        },


        newStatus: {
            type: 'boolean'
        }

    },


    exits: {

        notRunningPatch: {
            responseType: 'badRequest'
        }

    },


    fn: async function (inputs, exits) {

        if (inputs.newStatus === true) {
            let server = await SdtdServer.findOne(inputs.serverId);
            let runningPatch = await checkIfRunningPrismaPatch(server);
            if (!runningPatch) {
                return exits.notRunningPatch(`You must run the Allocs patch made by Prisma to enable inventory tracking again. See discord announcements! CSMM detected you are running ${detectedVersion}`)
            }
        }
        await SdtdConfig.update({ server: inputs.serverId }, { inventoryTracking: inputs.newStatus });
        sails.log.info(`Set inventory tracking for server ${inputs.serverId} to ${inputs.newStatus}`);
        return exits.success();

    }


};


function checkIfRunningPrismaPatch(sdtdServer) {
    return new Promise((resolve, reject) => {
        sevenDays.executeCommand({
            ip: sdtdServer.ip,
            port: sdtdServer.webPort,
            authName: sdtdServer.authName,
            authToken: sdtdServer.authToken,
            command: 'version'
        }).exec({
            success: (response) => {
                let splitResult = response.result.split('\n');
                let mapRenderingEntry = _.find(splitResult, (versionLine) => {
                    return versionLine.startsWith('Mod Allocs MapRendering and Webinterface:')
                })
                detectedVersion = mapRenderingEntry;
                resolve(mapRenderingEntry.endsWith('25.1') || mapRenderingEntry.endsWith('25.1\r'))
            },
            unknownCommand: (error) => {
                resolve(false);
            },
            error: (error) => {
                resolve(false);
            }
        });

    })
}
