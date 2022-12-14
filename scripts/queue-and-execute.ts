import { ethers, network } from "hardhat"
import {
    MIN_DELAY,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"
import * as fs from "fs"

export async function queueAndExecute() {
    const args = [NEW_STORE_VALUE]
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

    const governor = await ethers.getContract("GovernorContract")
    console.log("Queueing...")
    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await queueTx.wait()

    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1)
    }

    console.log("Executing...")
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait()

    console.log("Executed.")

    const boxNewValue = await box.retrieve()
    console.log(`New Box value: ${boxNewValue.toString()}`)
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
