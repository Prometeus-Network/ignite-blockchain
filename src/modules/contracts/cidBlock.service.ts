import {Web3Service} from './web3.service';
import Web3 from 'web3';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '../../config/config.service';

@Injectable()
export class CidBlockService {
    private readonly web3: Web3;

    constructor(
        private readonly web3Service: Web3Service,
        private readonly configService: ConfigService,
    ) {
        this.web3 = web3Service.httpInstancePrivateNet();
    }

    public contract() {
        return new this.web3.eth.Contract(
            this.configService.getCidBlockContractAbi(),
            this.configService.getCidBlockContractAddress(),
        );
    }

    public transactionSendData() {
        const from = this.configService.getPrivateNetAddress();
        const gas = 1e6;
        const gasPrice = 8 * 1e9
        return {from, gas, gasPrice};
    }

    // public async submitBlock(cid: string): Promise<any> {
    //     const contract = this.contract();
    //     await this.web3.eth.personal.unlockAccount(
    //         this.configService.getPrivateNetAddress(),
    //         this.configService.get('PRIVATE_NETWORK_ADDRESS_PASSWORD'),
    //         600
    //     );
    //     return contract.methods.submitBlock(cid).send(this.transactionSendData());
    // }

    public async submitBlock(cid: string): Promise<any> {
        const contract = this.contract();
        const pushBlock = await contract.methods.submitBlock(cid);
        const pushBlockAbi = pushBlock.encodeABI();

        const estimateGas = await contract.methods.submitBlock(cid).estimateGas({
            from: this.configService.getPrivateNetAddress()
        });

        const count = await this.web3.eth.getTransactionCount(
            this.configService.getPrivateNetAddress()
        );
        const signedTx = await this.web3.eth.accounts.signTransaction({
            nonce: count,
            from: this.configService.getPrivateNetAddress(),
            to: this.configService.getCidBlockContractAddress(),
            data: pushBlockAbi,
            gas: estimateGas,
        }, this.configService.get('PRIVATE_NETWORK_ADDRESS_PRIVATE_KEY'));
        return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }

    public async getPlasmaBlock(blockNumber: number) {
        const contract = this.contract();
        return contract.methods.plasmaChain(blockNumber).call();
    }

    public async lastCommittedBlock() {
        const contract = this.contract();
        return contract.methods.lastCommittedBlock().call();
    }
}
