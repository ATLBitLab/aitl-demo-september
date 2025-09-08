import { useState, useEffect } from 'react';
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
  isConnected: boolean;
}

type AppView = 'welcome' | 'confirm' | 'wallet' | 'send' | 'receive' | 'send-review';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [walletState, setWalletState] = useState<WalletState>({
    isInitialized: false,
    balance: 0,
    address: '',
    isConnected: false
  });
  const [sendAmount, setSendAmount] = useState<string>('');
  const [sendAddress, setSendAddress] = useState<string>('');
  const [confirmations, setConfirmations] = useState<boolean[]>([false, false]);

  // Initialize wallet
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        // For demo purposes, we'll create a new wallet each time
        // In a real app, you'd store the private key securely
        console.log('Wallet initialization would happen here');
      } catch (error) {
        console.log('No existing wallet found');
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
      
      // Reset form and go back to wallet
      setSendAmount('');
      setSendAddress('');
      setCurrentView('wallet');
    } catch (error) {
      console.error('Error sending bitcoin:', error);
    }
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
        
        <div className="confirm-items">
          <div className="confirm-item">
            <p>With bitcoin, you are your own bank. No one else has access to your private keys.</p>
            <BuiToggle
              checked={confirmations[0]}
              onChange={(e: any) => setConfirmations([e.target.checked, confirmations[1]])}
            />
          </div>
          
          <div className="confirm-item">
            <p>If you lose access to this app, and the backup we will help you create, your bitcoin cannot be recovered.</p>
            <BuiToggle
              checked={confirmations[1]}
              onChange={(e: any) => setConfirmations([confirmations[0], e.target.checked])}
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
          onClick={() => setCurrentView('wallet')}
        />
      </div>
    </div>
  );

  const renderWalletScreen = () => (
    <div className="wallet-screen">
      <div className="balance-section">
        <h2>₿ {walletState.balance.toFixed(8)}</h2>
        <p>$ {(walletState.balance * 100000).toFixed(2)}</p>
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
        
        <div className="qr-section">
          <BuiBitcoinQrDisplay />
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
          label="Share"
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