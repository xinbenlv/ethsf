import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("OpenSesame", function () {
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, alice, bob, charlie] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("OpenSesame");
        const contract = await Factory.deploy();
        return {
            contract,
            owner,
            alice, bob, charlie,
        };
    }

    describe("Deployment", function () {
        it("Should be deployable", async function () {
            let {contract, owner, alice, bob, charlie} = await loadFixture(deployFixture);
            expect(contract.deployTransaction.gasLimit).to.be.lessThanOrEqual(3000000);
        });

        it("Should be able to correctly register player", async function () {
            let {contract, owner, alice, bob, charlie} = await loadFixture(deployFixture);
            await contract.connect(alice).registerPlayer();
            await contract.connect(bob).registerPlayer();
            expect(await contract.getPlayerId(alice.address)).to.equal(1);
            expect(await contract.getPlayerId(bob.address)).to.equal(2);
        });

        it("Should be able to receive treasury if knows answer", async function () {
            let { contract, owner, alice, bob, charlie } = await loadFixture(deployFixture);

            let validZKProofs = {
                alice:{
                    proof: "0x087b73c973f2cd755c350b97df1c8181dcac9d463280852432709a3ed973c6201cb3b12b657d1c446a440d4aecd7f82858fcd4b3dc81dd8206417440232ee1e91be12393936283fabfe84b691ffdfa2ebe8b085d41126ad53290cc323ddb3fa62a431e47dbe7788819d751d1f6b2e76ad8302e92a8e50d0343a49fac99a723b3090c8d736f24df1d97fec4f3c3f9b5ef6225e3b75dd59c726bdd3506aa73e55a0f55bef10bdeccdee871a3e6fcb20c8b95e0ff647ddd599ac067588b6d40042d01e2d829873e330a2a3b889273c729e487178b46b78ca1c6bdabcf001c1e0c2909105c6a70a5b9d95cc2bc8976b41c46c9c658f994d1f925eeaf26b7a8221bc40eef6f4588ad8e25ac905e2d4a7296d79fb8b73b321b3787852feff66ae77bd3273d74add61c2e224cadf06dc60760f0286e93a1bd8860ce5245b56eb12c17b818cee730eb7e9e7b6ebb8ed8822b7074d8bf4ec16dd2946e5edc1909af5f1d7b1e143f6e62dc34cb89b168fd07e0a11933a3ebb74fe6a44654ed0fdecd4575a028c25b91763adcf88987567672d54922849b4f5fee4067357987b8d825019fd81484b23bfff64acb5c78654e7c4d5dc82663ed91246edff88100f22f90e60dba0d97a9550799b00af6a9ba07bdbfbcbff0aa27c8319fc4052b208812c95779aa03ccb2f34104dfb9fdb6f024d3e098927ac1f14ff2dfd7643809ab1c45c0af141a80774c1812aaaebd734ea7ef4071f6dc392562afe8c136c1e34f2455de02a310f9e62286a8c75fff4c72164f9c92710f6d4a878775fabf8da4539916dbc889074a903b37fa2eb38644be146c0d792a3da2b265726456b97b86c36be682dc171def11e8dfd301986d073302cb4f33b210e728c299d27fe68abbb96a954549dd19310b467e1ad47140e221839091a8a52457425ac498d8495e289c92c74bf36228c1417d379179a762d389117616b6d6b59a9be4341e0f284489047ff6d4c443000dcfd711f094269a67c709e9f0a8057ef4926d50684170e104952063c1e7501a89f661b70c929dc554e081820e9128d72a286c6b9137e476598491b1ea7c9e07f3945d4f7883a95b0811f9ed9c0dcede357c9a974290d0ae6214a7630e6b13",
                    pubSig:["0x0000000000000000000000000000000000000000000000000000000000000001","0x11a5ec837a18eaa4b083de1c5feea9821a11f3e3353fcae9ffeb11b46214f381","0x0f18eaab146445a9f48132e17f4a8b1eb62eb85e07b7d3cc7848863c59094bfb","0x28db2df574d6cb6d353c02c5b5ae1aa28702d9ccb8eaaa88e4a2c80c52d4368a"]
                },
                bob: {
                    proof: "0x2904b32387ba89b07f2e06e87878c498e5728eae96e965d6a390549fdd10b6eb18c5f549464a5655905d7eaa4e6345d78d602386ad8e7075965cf0e8e1f1b1bd161ad892fadaef4ab62c2fbce39d2714bba7747d940745aac8c49b499888d22504a23d4213a9301840208228eea4fa73a768791b871c806ffdfe7c9dd3b5161a17fecf314ab1bb8283553e74912707119947534a32ea8a8a0d22426bd551233602cbe286b37a2f45663f8ac8e9b38a1b030388ea3bed7ee7c5652adb2803ae7c2628507827bf6db1a2f5ee638e9e26a110f4bfebc64d7cfb266588a1dea77bc713a661efc96f814c1456a45caa33e3dd185b3c4c4412b849d4eaafd7b88b4c7d06237c7c23ef732fe68842c3268e18809ce2cb1a6a487942864e37fbeb72436a13f388e5673d51f9e77fa037c6b6171d2d78b3ebecf0286974207842084b432b21b16d21b66aa4bf5cd6604fdb4930306763731c92edddcc309792aeae1a077205362c5f614ea3bb897aae12d6dcca32de8e8a20f135922f650cd8d7c2d099ce05c4b8adba284839551ce68d4c038935817313659fc0ba7a5d66f1a8da77c28c2c8d204c8c12f2e10f22ce2dcf1b019b7103dc41f4f9274c9eb3c27e60e8371b248daf77a67ed6e28e705dc870e77c4ece884ac9a968d2ce4b476918acbc85350f013513b44da13003746cd91ecedc7bc8bde00d9404b4487ed5fb89628241a715daa90900147466fd7e223d8d13de6e24a213bc26b92a821430e0f53773f5cc27efcae41d812baabe30a77893207adaec4a84d5a77f84cd8b57e1b6f063e2731070eb6a70a948f173bd027672b3a8400a03751884d6457c1814f2c8a80417861d4ffd403dedccf9f0e7387a0d398381e659ce176de354aa25546e04e8d36c001a42765d562dc44e57c6c900d034c8d3df04db99f509e863c379415ec12a4bac17bda87a2226a3171d14e1d317d4e7b876888792c18f08da213402fc703ac9581ce4caa02622daa028d4e60cb316a0a66cb91fd6e2d81a565cac09d94b91f58414ccf7ac16245c4731b3edc6f44cf7edda5aaf1bd87fa074e6af60708fbc9a6d1c5f213cdf907fcf83e91c2fb5ed4bf0ca7d9c13492f3ec833c824b65481e089",
                    pubSig:["0x0000000000000000000000000000000000000000000000000000000000000002","0x11a5ec837a18eaa4b083de1c5feea9821a11f3e3353fcae9ffeb11b46214f381","0x0f18eaab146445a9f48132e17f4a8b1eb62eb85e07b7d3cc7848863c59094bfb","0x28db2df574d6cb6d353c02c5b5ae1aa28702d9ccb8eaaa88e4a2c80c52d4368a"]
                }
            };
            await contract.connect(alice).registerPlayer();
            await contract.connect(bob).registerPlayer();
            expect(await contract.getPlayerId(alice.address)).to.equal(1);
            expect(await contract.getPlayerId(bob.address)).to.equal(2);

            await charlie.sendTransaction({to: contract.address, value: ethers.utils.parseEther("3000.0")});
            await bob.sendTransaction({to: contract.address, value: ethers.utils.parseEther("3000.0")});
            expect(await contract.verifyProof(validZKProofs.alice.proof, validZKProofs.alice.pubSig)).to.be.true;
            expect(await contract.verifyProof(validZKProofs.bob.proof, validZKProofs.bob.pubSig)).to.be.true;
            expect(await ethers.provider.getBalance(contract.address)).to.equal(ethers.utils.parseEther("6000.0"));
            expect(await alice.getBalance()).to.be.greaterThan(ethers.utils.parseEther("9999.0"));
            await contract.connect(alice).claimWithProof(alice.address, validZKProofs.alice.proof, validZKProofs.alice.pubSig.slice(1));
            expect(await alice.getBalance()).to.be.greaterThan(ethers.utils.parseEther("15999.0"));
            expect(await ethers.provider.getBalance(contract.address)).to.equal(ethers.utils.parseEther("0"));
        });
    });

});
