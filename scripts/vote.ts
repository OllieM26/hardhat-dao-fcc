import { ethers, network } from "hardhat"
import { developmentChains, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs"

const index = 0

async function main(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    // 0 = against, 1 = for, 2 = abstain
    const voteWay = 1
    const governor = await ethers.getContract("GovernorContract")
    console.log("Voting...")
    const voteTxResponse = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        "Because I think its a good idea!"
    )
    await voteTxResponse.wait()

    console.log("Vote cast.")

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
