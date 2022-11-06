import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

task('guru', 'Conduct guru proof and then claim.')
    .addParam("signerIndex", "Index of signer", "1")
    .addParam("addressOpenSesame", "Address of OpenSesame contract.", "0x3EC5C0e5C0C14b4e4f72065A8687DC792603a726")
    .addParam("ensLabel","Label for ENS, default to guru", "guru")
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const index = args.signerIndex;
        const addressOpenSesame = args.addressOpenSesame;
        const label = args.ensLabel;
        console.log(`index = ${index}, addressOpenSesame = ${addressOpenSesame}, label = ${label}`);
        const signer = (await hre.ethers.getSigners())[parseInt(index)] as SignerWithAddress;
        let openSesame =  new hre.ethers.Contract(addressOpenSesame , [
            "function guruProof(address _to, bytes memory _proof, uint[] calldata _otherPubSignals) public",
            "function claimTreasure(address _guru) public",
            "function claimENS(address _to, string memory _ensName) public",
            "function verifyProof(bytes memory proof, uint[] memory pubSignals) public view returns (bool)"
        ] , signer);
        const zkProof = "0x087b73c973f2cd755c350b97df1c8181dcac9d463280852432709a3ed973c6201cb3b12b657d1c446a440d4aecd7f82858fcd4b3dc81dd8206417440232ee1e91be12393936283fabfe84b691ffdfa2ebe8b085d41126ad53290cc323ddb3fa62a431e47dbe7788819d751d1f6b2e76ad8302e92a8e50d0343a49fac99a723b3090c8d736f24df1d97fec4f3c3f9b5ef6225e3b75dd59c726bdd3506aa73e55a0f55bef10bdeccdee871a3e6fcb20c8b95e0ff647ddd599ac067588b6d40042d01e2d829873e330a2a3b889273c729e487178b46b78ca1c6bdabcf001c1e0c2909105c6a70a5b9d95cc2bc8976b41c46c9c658f994d1f925eeaf26b7a8221bc40eef6f4588ad8e25ac905e2d4a7296d79fb8b73b321b3787852feff66ae77bd3273d74add61c2e224cadf06dc60760f0286e93a1bd8860ce5245b56eb12c17b818cee730eb7e9e7b6ebb8ed8822b7074d8bf4ec16dd2946e5edc1909af5f1d7b1e143f6e62dc34cb89b168fd07e0a11933a3ebb74fe6a44654ed0fdecd4575a028c25b91763adcf88987567672d54922849b4f5fee4067357987b8d825019fd81484b23bfff64acb5c78654e7c4d5dc82663ed91246edff88100f22f90e60dba0d97a9550799b00af6a9ba07bdbfbcbff0aa27c8319fc4052b208812c95779aa03ccb2f34104dfb9fdb6f024d3e098927ac1f14ff2dfd7643809ab1c45c0af141a80774c1812aaaebd734ea7ef4071f6dc392562afe8c136c1e34f2455de02a310f9e62286a8c75fff4c72164f9c92710f6d4a878775fabf8da4539916dbc889074a903b37fa2eb38644be146c0d792a3da2b265726456b97b86c36be682dc171def11e8dfd301986d073302cb4f33b210e728c299d27fe68abbb96a954549dd19310b467e1ad47140e221839091a8a52457425ac498d8495e289c92c74bf36228c1417d379179a762d389117616b6d6b59a9be4341e0f284489047ff6d4c443000dcfd711f094269a67c709e9f0a8057ef4926d50684170e104952063c1e7501a89f661b70c929dc554e081820e9128d72a286c6b9137e476598491b1ea7c9e07f3945d4f7883a95b0811f9ed9c0dcede357c9a974290d0ae6214a7630e6b13",
        const zkPubSig = ["0x0000000000000000000000000000000000000000000000000000000000000001","0x11a5ec837a18eaa4b083de1c5feea9821a11f3e3353fcae9ffeb11b46214f381","0x0f18eaab146445a9f48132e17f4a8b1eb62eb85e07b7d3cc7848863c59094bfb","0x28db2df574d6cb6d353c02c5b5ae1aa28702d9ccb8eaaa88e4a2c80c52d4368a"]

        const attemptVerifySuccess:boolean = await openSesame.verifyProof(zkProof, zkPubSig);
        console.log(`attemptVerifySuccess = ${attemptVerifySuccess}`);
        let tx1 = await openSesame.guruProof(
            signer.address,
            zkProof,
            zkPubSig.slice(1)
        );
        console.log(`tx1: ${JSON.stringify(tx1, null, 2)}`);
        for (let i = 0; i < 6; i++) {
            console.log(`Block ${i}...`);
            await tx1.wait(i); // wait for confirm
        }
        let tx2 = await openSesame.claimTreasure(signer.address);
        console.log(`tx2: ${JSON.stringify(tx2, null, 2)}`);
        let tx3 = await openSesame.claimENS(signer.address, label);
        console.log(`tx3: ${JSON.stringify(tx3, null, 2)}`);
    });
