'use client';

import { type Wallet, useWallet } from "@txnlab/use-wallet-react";
import { toast } from "react-toastify";
import "../styles/sad.css";

const ConnectWalletModal = ({
  wallets,
  isOpen,
  onClose,
}: {
  wallets: Wallet[]
  isOpen: boolean
  onClose: () => void
}) => {
  const { activeAccount } = useWallet() // Moved useWallet hook to the top level

  if (!isOpen) return null

  const handleWalletClick = async (wallet: Wallet) => {
    try {
      if (wallet.isConnected) {
        await wallet.setActive()
        toast.success("Wallet set as active")
      } else {
        await wallet.connect()
        toast.success("Wallet connected successfully")
      }
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Failed to connect wallet")
    }
  }

  const disconnectWallets = async () => {
    try {
      for (const wallet of wallets) {
        if (wallet.isConnected) {
          await wallet.disconnect()
        }
      }
      toast.success("Disconnected from all wallets")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Failed to disconnect wallets")
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Connect to a wallet</span>
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
        </div>

        {wallets.map((wallet) => (
          <div
            onClick={() => handleWalletClick(wallet)}
            key={wallet.id}
            className={`wallet-option ${wallet.activeAccount ? "connected" : ""}`}
          >
            <span>
              {wallet.metadata.name}{" "}
              {wallet.activeAccount &&
                `[${wallet.activeAccount.address.slice(0, 3)}...${wallet.activeAccount.address.slice(-3)}]`}
              {wallet.isActive && ` (active)`}
            </span>
            <img
              src={wallet.metadata.icon || "/placeholder.svg"}
              alt={`${wallet.metadata.name} Icon`}
              className="wallet-icon"
            />
          </div>
        ))}

        {activeAccount && (
          <div onClick={disconnectWallets} className={`wallet-option ${activeAccount ? "connected" : ""}`}>
            <span>
              Disconnect{" "}
              {activeAccount && `[${activeAccount.address.slice(0, 3)}...${activeAccount.address.slice(-3)}]`}
            </span>
          </div>
        )}

        <div className="modal-footer">
          <span>New to Algorand? </span>
          <a href="https://algorand.com/wallets" target="_blank" rel="noopener noreferrer">
            Learn more about wallets
          </a>
        </div>
      </div>
    </div>
  )
}

export default ConnectWalletModal

