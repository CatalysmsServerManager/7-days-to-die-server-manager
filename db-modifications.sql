/* Complex schemas are not great in Sails auto migrations
If you are running a CSMM instance with many servers or have high data throughput these commands can help you out. */

--- Indexes
ALTER TABLE sdtdconfig ADD UNIQUE INDEX IDX_sdtdconfig_server (`server` ASC);
ALTER TABLE historicalinfo ADD INDEX IDX_historicalinfo_createdAt (`createdAt` ASC);
ALTER TABLE player ADD UNIQUE INDEX IDX_player_steamId_server (`steamId` ASC, `server` ASC);
ALTER TABLE analytics ADD INDEX IDX_analytics_createdAt_server (`createdAt` ASC, `server` ASC);
ALTER TABLE trackinginfo ADD INDEX createdAt (createdAt ASC);
ALTER TABLE trackinginfo ADD INDEX server (server ASC);
ALTER TABLE customdiscordnotification ADD INDEX IDX_customdiscordnotification_server (`server` ASC);


-- Data types
ALTER TABLE gblcomment MODIFY content TEXT;
ALTER TABLE sdtdconfig MODIFY votingCommand TEXT;
ALTER TABLE customcommand MODIFY commandsToExecute TEXT;
ALTER TABLE customhook MODIFY commandsToExecute TEXT;
ALTER TABLE cronjob MODIFY command TEXT;
ALTER TABLE banentry MODIFY reason TEXT;