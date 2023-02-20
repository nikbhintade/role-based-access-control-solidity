const {
	loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RBAC", function () {
	async function deployFixture() {
		const [owner, creator, extra] = await ethers.getSigners();

		const RBAC = await ethers.getContractFactory("RBAC");
		const rbac = await RBAC.deploy();

		return { rbac, owner, creator, extra };
	}

	describe("Deployment", async function () {
		it("Should set owner as DEFAULT_ADMIN_ROLE", async function () {
			const { rbac, owner } = await loadFixture(deployFixture);
			const DEFAULT_ADMIN_ROLE = await rbac.DEFAULT_ADMIN_ROLE();
			expect(
				await rbac.hasRole(DEFAULT_ADMIN_ROLE, owner.address)
			).to.true;
			expect(await rbac.count()).to.be.equal(0);
		});
	});

	describe("Access Control", async function () {

		it("Should set correct role", async function () {
			const { rbac, owner, creator } = await loadFixture(deployFixture);
			const CREATOR = await rbac.CREATOR();
			expect(
				await rbac.grantCreatorRole(creator.address)
			).to.emit(
				rbac,
				"RoleGranted"
			).withArgs(
				CREATOR,
				creator.address,
				owner.address
			)
			expect(
				await rbac.hasRole(CREATOR, creator.address)
			).to.be.true;
		})

		it("Should revoke the role", async function () {
			const { rbac, owner, creator } = await loadFixture(deployFixture);
			await rbac.grantCreatorRole(creator.address);
			const CREATOR = await rbac.CREATOR();

			expect(
				await rbac.revokeCreatorRole(creator.address)
			).to.emit(
				rbac,
				"RoleRevoked"
			).withArgs(
				CREATOR,
				creator.address,
				owner.address
			)
			expect(
				await rbac.hasRole(CREATOR, creator.address)
			).to.be.false;
		})

		it("Should revert if non-role admin calls to grant or revoke role", async function () {
			const { rbac, owner, creator } = await loadFixture(deployFixture);
			await expect(
				rbac.connect(creator).grantCreatorRole(owner.address)
			).to.be.revertedWith(
				new RegExp("AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})")
			)
			await expect(
				rbac.connect(creator).revokeCreatorRole(owner.address)
			).to.be.revertedWith(
				new RegExp("AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})")
			)
		})

		it("Should creator should be able to renounce role", async function () {
			const { rbac, owner, creator } = await loadFixture(deployFixture);
			await rbac.grantCreatorRole(creator.address);
			const CREATOR = await rbac.CREATOR();

			expect(
				await rbac.connect(creator).renounceCreatorRole()
			).to.emit(
				rbac,
				"RoleRevoked"
			).withArgs(
				CREATOR,
				creator.address,
				owner.address
			)
			expect(
				await rbac.hasRole(CREATOR, creator.address)
			).to.be.false;
		})

		it("Should allow creator role to create entry", async function () {
			const { rbac, creator } = await loadFixture(deployFixture);
			await rbac.grantCreatorRole(creator.address);
			expect(await rbac.count()).to.be.equal(0);

			const data = ethers.utils.formatBytes32String("FIRST ENTRY");
			await rbac.connect(creator).createEntry(data);

			expect(await rbac.entries(0)).to.be.equal(data);
			expect(await rbac.count()).to.be.equal(1);
		})

		it("Should revert for caller without correct role", async function () {
			const { rbac, creator, extra } = await loadFixture(deployFixture);
			await rbac.grantCreatorRole(creator.address);

			const data = ethers.utils.formatBytes32String("FIRST ENTRY");
			await expect(
				rbac.connect(extra).createEntry(data)
			).to.be.revertedWith(
				new RegExp("AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})")
			)
		})
	})
});
