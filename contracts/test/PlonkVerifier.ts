import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PlonkVerifier", function () {
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, alice, bob, charlie] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("PlonkVerifier");
        const contract = await Factory.deploy();

        return {
            contract,
            owner,
            alice, bob, charlie,
        };
    }

    describe("Deployment", function () {

        it("Should be deployable", async function () {
            let {contract} = await loadFixture(deployFixture);
            expect(contract.deployTransaction.gasLimit).to.be.lessThanOrEqual(2000000);
        });

        it("Should ACCEPT valid proof", async function () {
            let {contract} = await loadFixture(deployFixture);
            const proof = "0x087b73c973f2cd755c350b97df1c8181dcac9d463280852432709a3ed973c6201cb3b12b657d1c446a440d4aecd7f82858fcd4b3dc81dd8206417440232ee1e91be12393936283fabfe84b691ffdfa2ebe8b085d41126ad53290cc323ddb3fa62a431e47dbe7788819d751d1f6b2e76ad8302e92a8e50d0343a49fac99a723b3090c8d736f24df1d97fec4f3c3f9b5ef6225e3b75dd59c726bdd3506aa73e55a0f55bef10bdeccdee871a3e6fcb20c8b95e0ff647ddd599ac067588b6d40042d01e2d829873e330a2a3b889273c729e487178b46b78ca1c6bdabcf001c1e0c2909105c6a70a5b9d95cc2bc8976b41c46c9c658f994d1f925eeaf26b7a8221bc40eef6f4588ad8e25ac905e2d4a7296d79fb8b73b321b3787852feff66ae77bd3273d74add61c2e224cadf06dc60760f0286e93a1bd8860ce5245b56eb12c17b818cee730eb7e9e7b6ebb8ed8822b7074d8bf4ec16dd2946e5edc1909af5f1d7b1e143f6e62dc34cb89b168fd07e0a11933a3ebb74fe6a44654ed0fdecd4575a028c25b91763adcf88987567672d54922849b4f5fee4067357987b8d825019fd81484b23bfff64acb5c78654e7c4d5dc82663ed91246edff88100f22f90e60dba0d97a9550799b00af6a9ba07bdbfbcbff0aa27c8319fc4052b208812c95779aa03ccb2f34104dfb9fdb6f024d3e098927ac1f14ff2dfd7643809ab1c45c0af141a80774c1812aaaebd734ea7ef4071f6dc392562afe8c136c1e34f2455de02a310f9e62286a8c75fff4c72164f9c92710f6d4a878775fabf8da4539916dbc889074a903b37fa2eb38644be146c0d792a3da2b265726456b97b86c36be682dc171def11e8dfd301986d073302cb4f33b210e728c299d27fe68abbb96a954549dd19310b467e1ad47140e221839091a8a52457425ac498d8495e289c92c74bf36228c1417d379179a762d389117616b6d6b59a9be4341e0f284489047ff6d4c443000dcfd711f094269a67c709e9f0a8057ef4926d50684170e104952063c1e7501a89f661b70c929dc554e081820e9128d72a286c6b9137e476598491b1ea7c9e07f3945d4f7883a95b0811f9ed9c0dcede357c9a974290d0ae6214a7630e6b13";
            const publicSignals = [
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x11a5ec837a18eaa4b083de1c5feea9821a11f3e3353fcae9ffeb11b46214f381",
                "0x0f18eaab146445a9f48132e17f4a8b1eb62eb85e07b7d3cc7848863c59094bfb",
                "0x28db2df574d6cb6d353c02c5b5ae1aa28702d9ccb8eaaa88e4a2c80c52d4368a"
            ];
            expect(await contract.verifyProof(proof, publicSignals)).to.be.true;
        });

        it("Should REJECT valid proof", async function () {
            let {contract} = await loadFixture(deployFixture);
            const proof = "0x2df2259727fd5a079f2939fd0b2a541b063f10b83d3ad00243b53b5e50d285f920debb8d8d67e1d58ab57c0724d936ec6418ad7e993f3457f79ddfdbf90941080011faf2c13932abe17dd08ed3b8d32650cc88d6cbedf37a3a547b13aab6f5e2071ac3affd5948e54e7dca14292d426d7d265b6489694b93524a6c9f80516826191d5d60d6f9f509d2630394b8d4fdf1995fb863e1e576dee8fe51682085e99c173aed15ac272722d2003179840edab740f7ff4fac3cd64caa75ca2d03fb55260018360b36486636b77f85e63147b75c67b8a52ae008004005b476681cc93355061be590c1b20792d7cc72b09365392ef28eb1d52f614f73edc0ada0e5c38cc2066bbafd7295cf804ef81654ca20c6c5f5c48cd47f55e13dd867f45775a3fe56136650844ffd10077de50c58d78f8a06d1a423a192302a0cc9aacf2ea373f818007dc6177e5b4b7459dea65b5d1039e891644ea70c666d13ef4a1ddceb4a8aed0799c92d05d43972dac3d44c7349eda85b19fb71895f636da7782e5757978cf21bdfedcf5af1a618dc11bf7ed5202d050c620e7d8116fbd8c10e31a7de3217fc1a9fab3db190488ddf6343ba3ce14b79053f4789fb210039d84026a43261d50905ef97f523dbf58c73ead33341776de7c9e589f82f37d8c5b0cae8711a3da0c029d3381d85910891f4cf2352a9ebe0870a6b8274d2f82b83f58c0af764af983a00cae15b92fd89cebd9c31139868d37ba7c7f93e6a4695e6d4f90f59dcc9248f2ba5d4581c1e39673481d1f4eec91691a3a4b21b22905c411c0ddfe8180ba12026760c8044ae66bb32fb219f4f50ea79bc48f58970c9b12019db0c70e1d39dc72c83bfc04a181df97e7e1035ba188ddb77e04cd4d6265ff3962a3081dce0adb1091578dde9bd494f5cde9d5e3b67a1abbdc73b3d2d69ea5a3eb4b23717f74e781f9b692d9d6a402383aa5303afcf537f92a139c991d607c069ca4b4015f4166e03907fc775c7c0ea589f942102b4de5ff9afd95e6f90b099bc3362fb812633bb1e502a8bd2c9c9608f37cca560b1500e2ee307a5bd193361b97f6824c5f254701c6b3530e5bb5ac709cd79b8a635b6896e61f89f9781e79a8d6483e3a8f04e35";
            const publicSignals = [
                "0x1a8df29f3b5dd6af01c87649adb6eb8e0a177df7a05558db32bd8b9131bb3be9",
                "0x2239b6be9e77e91d29ebb8361dbc83743df08dc7349342c6de611d41acc21cfa",
                "0x1a96fb59ddd99363701898b8127bb078cbef58309d1bc3faf95977d6d038e4b4"
            ];
            expect(await contract.verifyProof(proof, publicSignals)).to.be.false;
        });
    });

});
