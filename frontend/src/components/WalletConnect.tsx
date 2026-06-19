/*eslint-disable*/
import { useEffect, useState } from "react";

export function WalletConnect() {

    // I have to write some functions, does metamask exists?
    // that can be checked via: window.ethereum object 

    // check wallet connection function 
    const [accounts, setAccounts] = useState<string | null>(null);
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
    const [chainId, setChainId] = useState<string>("");
    const [balance, setBalance] = useState<number>(0);

    // this function checks: was the wallet connected already? if Yes? then load the first account, it does not request Metamask, it checks 
    // browser instead  
    const checkWalletConnection = async () => {
        if (!window.ethereum) {
            alert('Wallet not found!');
            return;
        };

        try {
            const accounts = await window.ethereum!.request({
                method: 'eth_accounts',
            }) as string[];

            if (accounts.length > 0) {
                setAccounts(accounts[0]);
                setIsWalletConnected(true);
            };

        } catch (error) {
            console.error(error);
        };
    }

    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum!.request({
                method: 'eth_requestAccounts',
            }) as string[];

            if (accounts.length > 0) {
                setAccounts(accounts[0]);
                setIsWalletConnected(true);
            };

        } catch (error) {
            console.error(error);
        }
    }

    const getChainId = async () => {
        try {
            const chainId = await window.ethereum!.request({
                method: 'eth_chainId',
            }) as string;

            if (chainId) {
                setChainId(chainId);
            };
        } catch (error) {
            console.error(error);
        }
    }

    const getBalance = async (address: string) => {
        try {
            const balance = await window.ethereum!.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
            }) as string;

            if (balance) {
                const balanceInEth = parseInt(balance, 16) / 1e18;
                setBalance(balanceInEth);
            };

        } catch (error) {
            console.error(error);
        }
    }

    const disConnectedWallet = async () => {
        try {
            setAccounts(null);
            setBalance(0);
            setChainId("")
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        checkWalletConnection();
        getChainId();

        const handleAccountsChanged = (accounts: string[]) => {
            const accs = accounts;
            if (accs.length > 0) {
                setAccounts(accs[0]);
                getBalance(accs[0]);
            } else {
                setAccounts(null);
                setBalance(0);
            }
        };

        const handleChainChanged = (chainId: string) => {
            setChainId(chainId);
        }

        window.ethereum?.on('accountsChanged', handleAccountsChanged);
        window.ethereum?.on('chainChanged', handleChainChanged);

        // cleanup — removes listener when component unmounts
        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [])

    // useEffect
    useEffect(() => {
        if (accounts) {
            getBalance(accounts);
        }
    }, [accounts]);



    return (
        <div>
            {accounts ? (
                <>
                    <p>Connected Account Address: {accounts}</p>
                    <p>Account balance in Eth: {balance}</p>
                    <p>Chain id: {chainId}</p>
                    <p>Status: Connected</p>
                    <button onClick={disConnectedWallet}>Disconnect</button>
                </>
            ) : (
                <>
                    <p>Status: Not Connected</p>
                    <button onClick={connectWallet}>Connect Wallet</button>
                </>
            )}
        </div>
    )
}


// Extend window type to include ethereum
declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean;

            request: (args: RequestArguments) => Promise<unknown>;

            on(event: 'accountsChanged', callback: (accounts: string[]) => void): void;
            on(event: 'chainChanged', callback: (chainId: string) => void): void;
            on(event: 'disconnect', callback: (error: { code: number; message: string }) => void): void;

            removeListener(event: 'accountsChanged', callback: (accounts: string[]) => void): void;
            removeListener(event: 'chainChanged', callback: (chainId: string) => void): void;
            removeListener(event: 'disconnect', callback: (error: { code: number; message: string }) => void): void;
        };
    }
}

interface RequestArguments {
    method: 'eth_accounts' | 'eth_requestAccounts' | 'eth_chainId' | 'eth_getBalance';
    params?: unknown[];
}