import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("")
    log("---------------")
    log("")

    log("Deploying TimeLock...")

    const proposers = []
    const executors = []
    const args = [MIN_DELAY, proposers, executors]

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })
}

export default deployTimeLock
