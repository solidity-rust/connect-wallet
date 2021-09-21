import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import * as ethers from 'ethers'
import {
  ConnectionRejectedError,
  UseWalletProvider,
  useWallet,
} from 'use-wallet'

const { providers: EthersProviders, utils, EtherSymbol } = ethers

function App() {
  const wallet = useWallet()
  const blockNumber = wallet.getBlockNumber()

  const activate = connector => wallet.connect(connector)

  return (
    <>
      <h1>use-wallet</h1>

      {(() => {
        if (wallet.error?.name) {
          return (
            <p>
              <span>
                {wallet.error instanceof ConnectionRejectedError
                  ? 'Connection error: the user rejected the activation'
                  : wallet.error.name}
              </span>
              <button onClick={() => wallet.reset()}>retry</button>
            </p>
          )
        }

        if (wallet.status === 'connecting') {
          return (
            <p>
              <span>Connecting to {wallet.connector}…</span>
              <button onClick={() => wallet.reset()}>cancel</button>
            </p>
          )
        }

        if (wallet.status === 'connected') {
          return (
            <p>
              <span>Connected.</span>
              <button onClick={() => wallet.reset()}>disconnect</button>
            </p>
          )
        }

        return (
          <div className="connect">
            <div className="connect-label">Connect:</div>
            <div className="connect-buttons">
              <button onClick={() => activate('injected')}>injected</button>
              <button onClick={() => activate('bsc')}>bsc</button>
              <button onClick={() => activate('frame')}>frame</button>
              <button onClick={() => activate('portis')}>portis</button>
              <button onClick={() => activate('fortmatic')}>fortmatic</button>
              <button onClick={() => activate('torus')}>torus</button>
              <button onClick={() => activate('walletconnect')}>
                walletconnect
              </button>
              <button onClick={() => activate('walletlink')}>walletlink</button>
            </div>
          </div>
        )
      })()}

      {wallet.connected && (
        <>
          <p>
            <span>Account:</span>
            <span>{wallet.account}</span>
          </p>
        </>
      )}

      {wallet.account && (
        <p>
          <span>Balance:</span>
          <span>
            {wallet.balance === '-1'
              ? '…'
              : `${utils.formatEther(wallet.balance)} ETH`}
          </span>
        </p>
      )}

      {wallet.connected && (
        <p>
          <span>Block:</span> <span>{blockNumber || '…'}</span>
        </p>
      )}
    </>
  )
}

ReactDOM.render(
  <UseWalletProvider
      chainId={1}
      connectors={{
            fortmatic: { apiKey: '' },
            portis: { dAppId: '' },
            walletconnect: { rpcUrl: 'https://mainnet.eth.aragon.network/' },
            walletlink: { url: 'https://mainnet.eth.aragon.network/' },
      }}
  >
      <App />
  </UseWalletProvider>,
    document.getElementById('root')
);