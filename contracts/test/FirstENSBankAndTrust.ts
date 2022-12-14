import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TheResolver", function () {
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, alice, bob, charlie] = await ethers.getSigners();

        const FirstENSBankAndTrust = await ethers.getContractFactory("FirstENSBankAndTrust");
        const firstENSBankAndTrust = await FirstENSBankAndTrust.deploy();

        const ENSForTesting = await ethers.getContractFactory("ENSForTesting");
        const ensForTesting = await ENSForTesting.deploy();

        const ERC721ForTesting = await ethers.getContractFactory("ERC721ForTesting");
        const erc721ForTesting = await ERC721ForTesting.deploy();

        await firstENSBankAndTrust.setENS(ensForTesting.address);
        expect(await firstENSBankAndTrust.getENS()).to.equal(ensForTesting.address);

        return {
            firstENSBankAndTrust,
            ensForTesting,
            erc721ForTesting,
            owner,
            alice, bob, charlie,
        };
    }

    describe("Deployment", function () {
        it("Should be deployable", async function () {
            await loadFixture(deployFixture);
        });
    });

    describe("Receive and Claim Token", function () {
        const fakeTokenId = 3;
        const fakeReceiverENS = "bob.xinbenlvethsf.eth";
        const fakeReceiverENSNamehash = ethers.utils.namehash(fakeReceiverENS);
        it("Should ACCEPT transfer if a node is specified.", async function () {
            const {
                firstENSBankAndTrust,
                erc721ForTesting,
                owner, alice, bob, charlie
            } = await loadFixture(deployFixture);
            await erc721ForTesting.mint(charlie.address, fakeTokenId);
            expect(await erc721ForTesting.ownerOf(fakeTokenId)).to.equal(charlie.address);
            await erc721ForTesting.connect(charlie)["safeTransferFrom(address,address,uint256,bytes)"](
                charlie.address,
                firstENSBankAndTrust.address,
                fakeTokenId,
                ethers.utils.arrayify(fakeReceiverENSNamehash)
            );

            expect(await erc721ForTesting.ownerOf(fakeTokenId)).to.equal(firstENSBankAndTrust.address);
        });

        it("Should REJECT transfer if a node is NOT specified.", async function () {
            const {
                firstENSBankAndTrust,
                erc721ForTesting,
                owner, alice, bob, charlie
            } = await loadFixture(deployFixture);
            await erc721ForTesting.mint(charlie.address, fakeTokenId);
            expect(await erc721ForTesting.ownerOf(fakeTokenId)).to.equal(charlie.address);
            await expect(erc721ForTesting.connect(charlie)["safeTransferFrom(address,address,uint256,bytes)"](
                charlie.address, firstENSBankAndTrust.address, fakeTokenId, []))
                .to.be.rejectedWith("ENSTokenHolder: last data field must be ENS node.");
        });

        it("Should REJECT claimTo if ENS owner is not msg.sender", async function () {

            const {
                firstENSBankAndTrust,
                erc721ForTesting,
                ensForTesting,
                owner: deployer, alice, bob, charlie
            } = await loadFixture(deployFixture);
            // Steps of testing:
            // mint to charlie
            // charlie send to ENSTrust and recorded under bob.xinbenlvethsf.eth
            // bob try to claimTo alice, first time it should be rejected
            // bob then set the ENS record
            // bob claim to alice, second time it should be accepted

            // mint to charlie
            await erc721ForTesting.mint(charlie.address, fakeTokenId);

            // charlie send to ENSTrust and recorded under bob.xinbenlvethsf.eth
            await erc721ForTesting.connect(charlie)["safeTransferFrom(address,address,uint256,bytes)"](
                charlie.address, firstENSBankAndTrust.address,
                fakeTokenId,
                fakeReceiverENSNamehash
            );

            // bob try to claimTo alice, first time it should be rejected
            await expect(firstENSBankAndTrust.connect(bob).claimTo(
                alice.address,
                fakeReceiverENSNamehash,
                firstENSBankAndTrust.address,
                fakeTokenId
                ))
                .to.be.rejectedWith("ENSTokenHolder: node not owned by sender");

            // bob then set the ENS record
            await ensForTesting.setOwner(
                fakeReceiverENSNamehash, bob.address
            );

            // bob claim to alice, second time it should be accepted
            await firstENSBankAndTrust.connect(bob).claimTo(
                alice.address,
                fakeReceiverENSNamehash,
                erc721ForTesting.address,
                fakeTokenId
            );
            expect(await erc721ForTesting.ownerOf(fakeTokenId)).to.equal(alice.address);
        });
        it("Should ACCEPT claimTo if ENS owner is not msg.sender", async function () {

            const {
                firstENSBankAndTrust,
                erc721ForTesting,
                ensForTesting,
                owner: deployer, alice, bob, charlie
            } = await loadFixture(deployFixture);
            // Steps of testing:
            // mint to charlie
            // charlie send to ENSTrust and recorded under bob.xinbenlvethsf.eth
            // bob try to claimTo alice, first time it should be rejected
            // bob then set the ENS record
            // bob claim to alice, second time it should be accepted

            // mint to charlie
            await erc721ForTesting.safeMint(firstENSBankAndTrust.address, fakeTokenId, fakeReceiverENSNamehash);

            // bob then set the ENS record
            await ensForTesting.setOwner(
                fakeReceiverENSNamehash, bob.address
            );

            // bob claim to alice, second time it should be accepted
            await firstENSBankAndTrust.connect(bob).claimTo(
                alice.address,
                fakeReceiverENSNamehash,
                erc721ForTesting.address,
                fakeTokenId
            );
            expect(await erc721ForTesting.ownerOf(fakeTokenId)).to.equal(alice.address);
        });
    });
});
