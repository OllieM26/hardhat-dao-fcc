import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("")
    log("---------------")
    log("")

    log("Deploying Box...")

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1,
    })

    log("Contract deployed.")

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContract("Box")
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTx.wait()

    log("Box contract ownership transferred to TimeLock.")
    log("")
}

export default deployBox
