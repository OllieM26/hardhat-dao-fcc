import { ethers, network } from "hardhat"
import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs"

export async function propose(args: any[], functionToCall: string, proposalDescription) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")

    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal description: \n ${proposalDescription}`)
    const proposeTx = await governor.propose(
        [box.address], // targets
        [0], // values
        [encodedFunctionCall], // calldatas
        proposalDescription // description
    )
    const proposeReceipt = await proposeTx.wait()

    if (developmentChains.includes(network.name)) {
        // move blocks forward
        await moveBlocks(VOTING_DELAY + 1)
    }

    console.log("Proposal submitted.")

    const proposalId = proposeReceipt.events[0].args.proposalId
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))

    console.log(proposalsFile, "updated.")
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
