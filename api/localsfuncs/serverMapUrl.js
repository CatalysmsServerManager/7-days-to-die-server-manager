module.exports = async (serverId) => {
  const sdtdServer = await SdtdServer.findOne(serverId).populate('config');

  // shouldn't happen
  if (!sdtdServer) { return null; }

  if (!sdtdServer.config[0].mapProxy) {
    const baseUrl = sails.helpers.sdtdApi.getBaseUrl(SdtdServer.getAPIConfig(sdtdServer));
    return `${baseUrl}/map/{z}/{x}/{y}.png?adminuser=${sdtdServer.authName}&admintoken=${sdtdServer.authToken}`;
  }
  return `/api/sdtdserver/${sdtdServer.id}/tile/{z}/{x}/{y}/tile.png`;
};
