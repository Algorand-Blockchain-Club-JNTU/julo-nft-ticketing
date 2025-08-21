import algosdk from "algosdk"

export interface WelcomeNFTMetadata {
  name: string
  description: string
  image: string
  properties: {
    type: "welcome"
    memberSince: string
    platform: "julo-nft-ticketing"
  }
}

export async function createWelcomeNFT(
  userAddress: string,
  algodClient: algosdk.Algodv2,
  transactionSigner: any
): Promise<number | null> {
  console.log("createWelcomeNFT function executed")
  try {
    const suggestedParams = await algodClient.getTransactionParams().do()
    
    const metadata: WelcomeNFTMetadata = {
      name: "Welcome to Julo NFT Ticketing",
      description: "Your exclusive welcome NFT for joining our platform",
      image: "ipfs://QmWelcomeNFTHash", // Replace with actual IPFS hash
      properties: {
        type: "welcome",
        memberSince: new Date().toISOString(),
        platform: "julo-nft-ticketing"
      }
    }

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender: process.env.PLATFORM_WALLET_ADDRESS!, // Platform wallet
      total: 1,
      decimals: 0,
      assetName: metadata.name,
      unitName: "WELCOME",
      assetURL: metadata.image,
      manager: process.env.PLATFORM_WALLET_ADDRESS!,
      reserve: process.env.PLATFORM_WALLET_ADDRESS!,
      freeze: undefined,
      clawback: undefined,
      defaultFrozen: false,
      suggestedParams,
      note: new TextEncoder().encode(JSON.stringify({
        standard: "arc69",
        ...metadata
      }))
    })

    const signedTxn = await transactionSigner([txn], [0])
    const { txid } = await algodClient.sendRawTransaction(signedTxn[0]).do()
    const result = await algosdk.waitForConfirmation(algodClient, txid, 4)
    
    const assetId = result["assetIndex"]
    
    // Transfer NFT to user
    const transferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: process.env.PLATFORM_WALLET_ADDRESS!,
      receiver: userAddress,
      assetIndex: assetId,
      amount: 1,
      suggestedParams
    })

    const signedTransferTxn = await transactionSigner([transferTxn], [0])
    await algodClient.sendRawTransaction(signedTransferTxn[0]).do()
    
    return assetId
  } catch (error) {
    console.error("Error creating welcome NFT:", error)
    return null
  }
}