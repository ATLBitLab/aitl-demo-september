import { useState, useEffect } from 'react';
import { SingleKey, Wallet } from '@arkade-os/sdk';
import { 
  BuiButtonReact as BuiButton, 
  BuiInputReact as BuiInput,
  BuiBitcoinQrDisplayReact as BuiBitcoinQrDisplay,
  BuiToggleReact as BuiToggle,
  BuiNumpadReact as BuiNumPad
} from 'bui/packages/ui/react';
import './App.css';

// Types
interface WalletState {
  isInitialized: boolean;
  balance: number;
  address: string;
  boardingAddress: string;
  isConnected: boolean;
  wallet?: Wallet;
}

type AppView = 'welcome' | 'confirm' | 'wallet' | 'send' | 'receive' | 'send-review';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [walletState, setWalletState] = useState<WalletState>({
    isInitialized: false,
    balance: 0,
    address: '',
    boardingAddress: '',
    isConnected: false
  });
  const [sendAmount, setSendAmount] = useState<string>('');
  const [sendAddress, setSendAddress] = useState<string>('');
  const [confirmations, setConfirmations] = useState<boolean[]>([false, false]);

  // Debug confirmation state changes
  useEffect(() => {
    console.log('Confirmation state changed:', confirmations);
  }, [confirmations]);

  // Initialize wallet from localStorage
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        // Check if wallet exists in localStorage
        const savedWallet = localStorage.getItem('ark-wallet');
        if (savedWallet) {
          const walletData = JSON.parse(savedWallet);
          console.log('Restoring wallet from localStorage:', walletData);
          
          // Try to restore the wallet instance if we have a private key
          let walletInstance = undefined;
          if (walletData.privateKey) {
            try {
              const privateKey = SingleKey.fromHex(walletData.privateKey);
              walletInstance = await Wallet.create({
                identity: privateKey,
                arkServerUrl: 'https://mutinynet.arkade.sh'
              });
              console.log('Wallet instance restored from private key');
            } catch (error) {
              console.log('Could not restore wallet instance:', error);
            }
          }
          
          setWalletState({
            isInitialized: true,
            balance: walletData.balance || 0,
            address: walletData.address || '',
            boardingAddress: walletData.boardingAddress || '',
            isConnected: true,
            wallet: walletInstance
          });
          
          setCurrentView('wallet');
        } else {
          console.log('No existing wallet found in localStorage');
        }
      } catch (error) {
        console.log('Error loading wallet from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('ark-wallet');
      }
    };

    initializeWallet();
  }, []);

  const createNewWallet = async () => {
    try {
      // For demo purposes, we'll simulate wallet creation
      // In a real app, you'd use: const wallet = await Wallet.create({...})
      console.log('Creating new wallet...');
      
      setWalletState({
        isInitialized: true,
        balance: 0,
        address: 'bc1p...demo-address',
        isConnected: true
      });
      
      setCurrentView('confirm');
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const handleContinueToWallet = async () => {
    try {
      // Create the actual wallet when user confirms
      console.log('Creating Ark wallet with confirmations...');
      
      // Generate a new private key for demo purposes
      // In production, you'd want to use a more secure method
      const privateKeyHex = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const privateKey = SingleKey.fromHex(privateKeyHex);
      console.log('Generated private key:', privateKeyHex);
      
      // Create wallet with ArkadeOS SDK using Mutinynet
      const wallet = await Wallet.create({
        identity: privateKey,
        arkServerUrl: 'https://mutinynet.arkade.sh'
      });
      
      // Get the Ark address and boarding address
      const arkAddress = await wallet.getAddress();
      const boardingAddress = await wallet.getBoardingAddress();
      
      console.log('Ark Address:', arkAddress);
      console.log('Boarding Address:', boardingAddress);
      
      const newWalletState = {
        isInitialized: true,
        balance: 0.00123456, // Demo balance
        address: arkAddress,
        boardingAddress: boardingAddress,
        isConnected: true,
        wallet: wallet
      };
      
      // Save wallet to localStorage (excluding the wallet instance)
      const walletData = {
        balance: newWalletState.balance,
        address: arkAddress,
        boardingAddress: boardingAddress,
        privateKey: privateKeyHex, // Store private key as hex string for restoration
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      localStorage.setItem('ark-wallet', JSON.stringify(walletData));
      console.log('Wallet saved to localStorage:', walletData);
      
      setWalletState(newWalletState);
      setCurrentView('wallet');
    } catch (error) {
      console.error('Error creating wallet:', error);
      // Fallback to demo wallet if Ark server is not available
      console.log('Falling back to demo wallet...');
      
      const newWalletState = {
        isInitialized: true,
        balance: 0.00123456,
        address: 'bc1p...ark-demo-address',
        boardingAddress: 'bc1p...boarding-demo-address',
        isConnected: true
      };
      
      const walletData = {
        balance: newWalletState.balance,
        address: newWalletState.address,
        boardingAddress: newWalletState.boardingAddress,
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      localStorage.setItem('ark-wallet', JSON.stringify(walletData));
      setWalletState(newWalletState);
      setCurrentView('wallet');
    }
  };

  const restoreWallet = () => {
    // TODO: Implement wallet restoration
    console.log('Restore wallet functionality to be implemented');
  };

  const handleSendBitcoin = async () => {
    if (!sendAmount || !sendAddress) return;
    
    try {
      // For demo purposes, we'll simulate sending bitcoin
      // In a real app, you'd use: await wallet.sendBitcoin({...})
      console.log('Sending bitcoin...', { to: sendAddress, amount: sendAmount });
      
      // Update wallet balance (subtract sent amount)
      const sentAmount = parseFloat(sendAmount) || 0;
      const newBalance = Math.max(0, walletState.balance - sentAmount);
      
      const updatedWalletState = {
        ...walletState,
        balance: newBalance
      };
      
      // Save updated wallet to localStorage
      const walletData = {
        balance: newBalance,
        address: walletState.address,
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      localStorage.setItem('ark-wallet', JSON.stringify(walletData));
      console.log('Updated wallet saved to localStorage:', walletData);
      
      setWalletState(updatedWalletState);
      
      // Reset form and go back to wallet
      setSendAmount('');
      setSendAddress('');
      setCurrentView('wallet');
    } catch (error) {
      console.error('Error sending bitcoin:', error);
    }
  };

  // Function to clear wallet (for testing)
  const clearWallet = () => {
    localStorage.removeItem('ark-wallet');
    setWalletState({
      isInitialized: false,
      balance: 0,
      address: '',
      boardingAddress: '',
      isConnected: false
    });
    setCurrentView('welcome');
    console.log('Wallet cleared from localStorage');
  };

  // Function to simulate receiving bitcoin (for testing)
  const simulateReceiveBitcoin = () => {
    const receivedAmount = 0.0001; // Small amount for testing
    const newBalance = walletState.balance + receivedAmount;
    
    const updatedWalletState = {
      ...walletState,
      balance: newBalance
    };
    
    // Save updated wallet to localStorage
    const walletData = {
      balance: newBalance,
      address: walletState.address,
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    localStorage.setItem('ark-wallet', JSON.stringify(walletData));
    console.log('Received bitcoin, updated wallet saved to localStorage:', walletData);
    
    setWalletState(updatedWalletState);
  };


  // Render different views based on current state
  const renderWelcomeScreen = () => (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="logo-section">
          <h1 className="logo">bwallet</h1>
          <p className="subtitle">Start sending & receiving bitcoin today</p>
        </div>
        
        <div className="button-section">
          <BuiButton
            styleType="filled"
            size="large"
            label="Create new wallet"
            wide
            onClick={createNewWallet}
          />
          <BuiButton
            styleType="outline"
            size="large"
            label="Restore wallet"
            wide
            onClick={restoreWallet}
          />
        </div>
      </div>
      
      <div className="footer-text">
        <p>A simple, open-source bitcoin wallet.</p>
        <a href="#" className="learn-more">Learn More →</a>
      </div>
    </div>
  );

  const renderConfirmScreen = () => (
    <div className="confirm-screen">
      <div className="top-nav">
        <button className="back-btn" onClick={() => setCurrentView('welcome')}>
          ← Back
        </button>
      </div>
      
      <div className="main-content">
        <h2>Before we continue</h2>
        
        {/* Debug info - remove in production */}
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
          Debug: Toggle 1: {confirmations[0] ? '✓' : '✗'}, Toggle 2: {confirmations[1] ? '✓' : '✗'}
        </div>
        
        <div className="confirm-items">
          <div className="confirm-item">
            <p>With bitcoin, you are your own bank. No one else has access to your private keys.</p>
            <BuiToggle
              checked={confirmations[0]}
              onClick={() => setConfirmations([!confirmations[0], confirmations[1]])}
            />
          </div>
          
          <div className="confirm-item">
            <p>If you lose access to this app, and the backup we will help you create, your bitcoin cannot be recovered.</p>
            <BuiToggle
              checked={confirmations[1]}
              onClick={() => setConfirmations([confirmations[0], !confirmations[1]])}
            />
          </div>
        </div>
      </div>
      
      <div className="bottom-nav">
        <BuiButton
          styleType="filled"
          size="large"
          label="Continue"
          wide
          disabled={!confirmations[0] || !confirmations[1]}
          onClick={handleContinueToWallet}
        />
      </div>
    </div>
  );

  const renderWalletScreen = () => (
    <div className="wallet-screen">
      <div className="balance-section">
        <h2>₿ {walletState.balance.toFixed(8)}</h2>
        <p>$ {(walletState.balance * 100000).toFixed(2)}</p>
        
        {/* Show Ark addresses */}
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
          <div>Ark Address: {walletState.address}</div>
          <div>Boarding Address: {walletState.boardingAddress}</div>
          <div>Wallet saved in localStorage: {localStorage.getItem('ark-wallet') ? '✓' : '✗'}</div>
        </div>
      </div>
      
      <div className="keypad-section">
        <BuiNumPad />
      </div>
      
      <div className="bottom-nav">
        <BuiButton
          styleType="outline"
          size="large"
          label="Send"
          onClick={() => setCurrentView('send')}
        />
        <BuiButton
          styleType="free"
          size="large"
          label="⚙️"
          onClick={clearWallet}
        />
        <BuiButton
          styleType="outline"
          size="large"
          label="Receive"
          onClick={() => setCurrentView('receive')}
        />
      </div>
    </div>
  );

  const renderSendScreen = () => (
    <div className="send-screen">
      <div className="top-nav">
        <button className="back-btn" onClick={() => setCurrentView('wallet')}>
          ← Back
        </button>
      </div>
      
      <div className="main-content">
        <h2>Send Bitcoin</h2>
        
        <div className="input-section">
          <BuiInput
            placeholder="Enter Bitcoin address"
            value={sendAddress}
            onChange={(e: any) => setSendAddress(e.target.value)}
          />
          
          <div className="button-row">
            <BuiButton
              styleType="outline"
              size="default"
              label="Paste"
            />
            <BuiButton
              styleType="outline"
              size="default"
              label="Scan QR"
            />
          </div>
        </div>
      </div>
      
      <div className="bottom-nav">
        <BuiButton
          styleType="filled"
          size="large"
          label="Continue"
          wide
          disabled={!sendAddress}
          onClick={() => setCurrentView('send-review')}
        />
        <BuiButton
          styleType="outline"
          size="large"
          label="Cancel"
          wide
          onClick={() => setCurrentView('wallet')}
        />
      </div>
    </div>
  );

  const renderReceiveScreen = () => (
    <div className="receive-screen">
      <div className="top-nav">
        <button className="back-btn" onClick={() => setCurrentView('wallet')}>
          ← Back
        </button>
      </div>
      
      <div className="main-content">
        <h2>Receive Bitcoin</h2>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px', textAlign: 'center' }}>
          Use your boarding address to receive Bitcoin
        </div>
        
        <div className="qr-section">
          <BuiBitcoinQrDisplay />
        </div>
        
        <div style={{ fontSize: '12px', color: '#666', marginTop: '16px', textAlign: 'center' }}>
          <div>Boarding Address: {walletState.boardingAddress}</div>
        </div>
      </div>
      
      <div className="bottom-nav">
        <BuiButton
          styleType="outline"
          size="large"
          label="Copy Address"
        />
        <BuiButton
          styleType="outline"
          size="large"
          label="Test Receive"
          onClick={simulateReceiveBitcoin}
        />
        <BuiButton
          styleType="filled"
          size="large"
          label="Done"
          wide
          onClick={() => setCurrentView('wallet')}
        />
      </div>
    </div>
  );

  const renderSendReviewScreen = () => (
    <div className="send-review-screen">
      <div className="top-nav">
        <button className="back-btn" onClick={() => setCurrentView('send')}>
          ← Back
        </button>
      </div>
      
      <div className="main-content">
        <h2>Review Before Sending</h2>
        
        <div className="review-details">
          <div className="detail-item">
            <div className="detail-label">
              <span>Estimated Amount</span>
              <span className="help-icon">?</span>
            </div>
            <div className="detail-value">
              <span>~₿ {sendAmount}</span>
              <span>~${(parseFloat(sendAmount) * 100000).toFixed(2)}</span>
            </div>
            <p className="detail-note">This amount will have a fee subtracted from it.</p>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">To</div>
            <div className="detail-value">
              <span>{sendAddress.slice(0, 20)}...{sendAddress.slice(-20)}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">
              <span>Estimated Fee</span>
              <span className="help-icon">?</span>
            </div>
            <div className="detail-value">
              <span>₿ 0.00001023</span>
              <span>$1.03</span>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">
              <span>Maximum Fee</span>
              <span className="help-icon">?</span>
            </div>
            <div className="detail-value">
              <span>₿ 0.00002104</span>
              <span>$2.13</span>
            </div>
          </div>
        </div>
        
        <p className="warning-text">
          Please double-check these details as there is no way to reverse this payment.
        </p>
      </div>
      
      <div className="bottom-nav">
        <BuiButton
          styleType="filled"
          size="large"
          label="Send Bitcoin"
          wide
          onClick={handleSendBitcoin}
        />
        <BuiButton
          styleType="outline"
          size="large"
          label="Cancel"
          wide
          onClick={() => setCurrentView('send')}
        />
      </div>
    </div>
  );

  // Main render logic
  switch (currentView) {
    case 'welcome':
      return renderWelcomeScreen();
    case 'confirm':
      return renderConfirmScreen();
    case 'wallet':
      return renderWalletScreen();
    case 'send':
      return renderSendScreen();
    case 'receive':
      return renderReceiveScreen();
    case 'send-review':
      return renderSendReviewScreen();
    default:
      return renderWelcomeScreen();
  }
}

export default App;