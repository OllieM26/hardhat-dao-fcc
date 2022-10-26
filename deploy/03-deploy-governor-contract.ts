import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {
    MIN_DELAY,
    QUORUM_PERCENTAGE,
    VOTING_DELAY,
    VOTING_PERIOD,
} from "../helper-hardhat-config"
import { getContractAddress } from "ethers/lib/utils"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")

    log("")
    log("---------------")
    log("")

    log("Deploying TimeGovernorContractLock...")

    const _token = governanceToken.address
    const _timelock = timeLock.address
    const _votingDelay = VOTING_DELAY
    const _votingPeriod = VOTING_PERIOD
    const _quorumPercentage = QUORUM_PERCENTAGE

    const args = [_token, _timelock, _votingDelay, _votingPeriod, _quorumPercentage]

    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })
}

export default deployGovernorContract
