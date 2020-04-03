import {HttpService, Injectable, Logger} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {SoterService} from './soter.service';
import {ArchiveService} from './archive.service';
import * as fs from 'fs';
import {SyncTime} from '../../model/syncTime.entity';
import {ConfigService} from '../../config/config.service';
import {MapService} from './map.service';
import AdmZip = require('adm-zip');
@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly soterService: SoterService,
        private readonly archiveService: ArchiveService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly mapService: MapService,
    ) {
    }

    @Cron('* * * * *')
    async handleCron() {
        const syncTime = await SyncTime.findLatestItem();
        try {
            if (syncTime && syncTime.synced === false) {
                this.logger.debug('Sync started!');
                const admZip = new AdmZip();
                const zipPath = `./files/${syncTime.hash}.zip`;
                admZip.addLocalFolder(await this.archiveService.generateDirPath(), '/');
                admZip.addFile('map.json', Buffer.from(JSON.stringify(syncTime.fileMap)));
                admZip.addFile('entities.json', Buffer.from(JSON.stringify(syncTime.entityMap)));
                admZip.writeZip(zipPath);

                const file = fs.readFileSync(zipPath);
                const soterResult = await this.soterService.add(file, syncTime.hash + '.zip');
                this.logger.debug('Zip file to Btfs saved!');

                const lastHash = new SyncTime();
                // tslint:disable-next-line:new-parens
                lastHash.hash = ((+new Date) + Math.random() * 100).toString(32);
                lastHash.createdAt = new Date();
                await lastHash.save();
                this.logger.debug('New zip file name generated!');

                syncTime.synced = true;
                syncTime.btfsCid = soterResult.data.cid;
                await syncTime.save();

                // const responseIgniteNode = await this.httpService.post(this.configService.getIgniteNodeAddress() + '/api/v3/btfs', {
                //     btfsCid: soterResult.data.cid,
                // }, {
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                // }).toPromise();

                this.logger.debug('Soter data: ' + JSON.stringify(soterResult.data));
                // this.logger.debug('Ignite node response status: ' + String(responseIgniteNode.status));
                this.logger.debug('Sync completed!');

                this.logger.debug('Sync Completed!');
                // this.logger.debug('Sync started!');
                // // const zipPath = await this.archiveService.zipPathGenerate();
                //
                // // if (!fs.existsSync(zipPath)) {
                // //     throw new Error('Zip file not created!');
                // // }
                // //
                // const zipName = await this.archiveService.getZipName();
                // const file = fs.readFileSync(zipPath);
                // this.logger.debug('Read zip file complete!');
                // const soterResult = await this.soterService.add(file, zipName);
                // this.logger.debug('Zip file to Btfs saved!');
                // const lastHash = new SyncTime();
                // // tslint:disable-next-line:new-parens
                // lastHash.hash = ((+new Date) + Math.random() * 100).toString(32);
                // lastHash.createdAt = new Date();
                // await lastHash.save();
                // this.logger.debug('New zip file name generated!');
                //
                // syncTime.synced = true;
                // syncTime.btfsCid = soterResult.data.cid;
                // await syncTime.save();
                //
                // const responseIgniteNode = await this.httpService.post(this.configService.getIgniteNodeAddress() + '/api/v3/btfs', {
                //     btfsCid: soterResult.data.cid,
                // }, {
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                // }).toPromise();
                //
                // this.logger.debug('Soter data: ' + JSON.stringify(soterResult.data));
                // this.logger.debug('Ignite node response status: ' + String(responseIgniteNode.status));
                // this.logger.debug('Sync completed!');
            } else {
                this.logger.debug('Sync not started!');
            }
        } catch (e) {
            this.logger.error(e.message);
        }
    }
}
