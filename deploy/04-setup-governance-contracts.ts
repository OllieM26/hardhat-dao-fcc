import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { log } = deployments
    const { deployer } = await getNamedAccounts()
    const timeLock = await ethers.getContract("TimeLock", deployer)
    const governor = await ethers.getContract("GovernorContract", deployer)

    log("")
    log("---------------")
    log("")

    log("Setting up roles...")

    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposerTx.wait()
    const executorTx = await timeLock.grantRole(executorRole, ethers.constants.AddressZero)
    await executorTx.wait()
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait()

    log("Roles assigned!")
}

export default setupContracts
