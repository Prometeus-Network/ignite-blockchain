import {Body, Controller, Get, Param, Post, Res} from '@nestjs/common';
import {Response} from 'express';
import {AddLikeHandler} from './useCase/addLike/addLike.handler';
import {Command as AddLikeCommand} from './useCase/addLike/command';
import {FileFetcher} from './fetchers/file.fetcher';
@Controller('/v1/like')
export class LikeController {
    constructor(
        private readonly addLikeHandler: AddLikeHandler,
        private readonly fileFetcher: FileFetcher,
    ) {
    }
    @Post()
    public async addLike(
        @Body('id') id: string,
        @Body('commentId') commentId: string,
        @Body('data') data: object,
        @Res() res: Response,
    ) {
        await this.addLikeHandler.handle(new AddLikeCommand(id, commentId, data));
        return res.status(200).send({message: 'Like success added!'});
    }

    @Get('/comment/:commentId')
    public async getLikeByCommentId(@Param('commentId') commentId: string, @Res() res: Response) {
        const likes = await this.fileFetcher.getById(commentId + '/likes.json');
        return res.send(JSON.parse(likes.toString()));
    }
}
