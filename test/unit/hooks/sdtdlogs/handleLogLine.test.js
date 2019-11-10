const chai = require("chai");
const expect = chai.expect;

const handleLogLine = require("../../../../api/hooks/sdtdLogs/handleLogLine");

describe("sdtdLogs#handleLogLine", () => {
  it("Correctly detects a death event", () => {
    const logLine = {
      date: "2017-11-14",
      time: "14:50:49",
      uptime: "133.559",
      msg:
        "PlayerSpawnedInWorld (reason: Died, position: 2796, 68, -1452): EntityID=6454, PlayerID='76561198028175941', OwnerID='76561198028175941', PlayerName='Catalysm'",
      trace: "",
      type: "Log"
    };

    const result = handleLogLine(logLine);

    expect(result.type).to.eq("playerDeath");
    expect(result.data.playerName).to.eq("Catalysm");
    expect(result.data.steamId).to.eq("76561198028175941");
    expect(result.data.entityId).to.eq("6454");
  });
});
