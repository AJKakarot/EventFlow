import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShoppingCart, 
  CreditCard, 
  Bell, 
  BarChart3, 
  Radio, 
  RefreshCw, 
  PlusCircle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Zap,
  Server,
  Database
} from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState([]);

  const [productName, setProductName] = useState('MacBook Pro M3 Max');
  const [amount, setAmount] = useState('199999.00');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastEvent, setLastEvent] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  const presetProducts = [
    { name: 'MacBook Pro M3 Max', price: '199999.00', icon: '💻' },
    { name: 'iPhone 16 Pro (256GB)', price: '119900.00', icon: '📱' },
    { name: 'Sony WH-1000XM5 ANC', price: '29990.00', icon: '🎧' },
    { name: 'Keychron Q1 Pro Wireless', price: '16500.00', icon: '⌨️' },
    { name: 'LG 34" UltraWide OLED', price: '84999.00', icon: '🖥️' }
  ];

  // Fetch all service data from Spring Boot APIs
  const fetchAllData = async () => {
    try {
      const [ordersRes, paymentsRes, notifRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/orders`).catch(() => null),
        fetch(`${API_BASE}/payments`).catch(() => null),
        fetch(`${API_BASE}/notifications`).catch(() => null),
        fetch(`${API_BASE}/analytics`).catch(() => null),
      ]);

      if (ordersRes && ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }

      if (paymentsRes && paymentsRes.ok) {
        setPayments(await paymentsRes.json());
      }
      if (notifRes && notifRes.ok) {
        setNotifications(await notifRes.json());
      }
      if (analyticsRes && analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setBackendStatus('disconnected');
    }
  };

  useEffect(() => {
    fetchAllData();
    if (!autoRefresh) return;
    const interval = setInterval(fetchAllData, 2000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Create Order & trigger Kafka event flow
  const handleCreateOrder = async (e) => {
    if (e) e.preventDefault();
    if (!productName || !amount) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          amount: parseFloat(amount),
          status: 'CREATED'
        })
      });

      if (res.ok) {
        const createdOrder = await res.json();
        setLastEvent({
          type: 'ORDER_CREATED',
          orderId: createdOrder.id,
          product: createdOrder.productName,
          amount: createdOrder.amount,
          time: new Date().toLocaleTimeString()
        });

        // Trigger immediate fetch to catch downstream consumer events
        setTimeout(fetchAllData, 600);
        setTimeout(fetchAllData, 1500);
      }
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px', minHeight: '100vh' }}>
      
      {/* Top Navbar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Zap size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EventFlow
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Real-Time Event-Driven Microservices Dashboard
            </p>
          </div>
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Server size={14} color="#818cf8" />
            <span>Spring Boot:</span>
            <span style={{ color: backendStatus === 'connected' ? '#10b981' : '#f43f5e', fontWeight: '600' }}>
              {backendStatus === 'connected' ? 'Port 8080 Active' : 'Offline'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Radio size={14} color="#a855f7" />
            <span>Kafka:</span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>Broker :9092</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Database size={14} color="#06b6d4" />
            <span>PostgreSQL:</span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>Neon Cloud</span>
          </div>

          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: autoRefresh ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${autoRefresh ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: autoRefresh ? '#34d399' : '#94a3b8',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={13} />
            {autoRefresh ? 'Live Sync (2s)' : 'Sync Paused'}
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Metric 1 */}
        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '12px', color: '#818cf8' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>TOTAL ORDERS</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>{orders.length}</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px', color: '#34d399' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>PAYMENTS PROCESSED</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#34d399' }}>{payments.length}</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '12px', color: '#fbbf24' }}>
            <Bell size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>NOTIFICATIONS SENT</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#fbbf24' }}>{notifications.length}</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '12px', borderRadius: '12px', color: '#22d3ee' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>ANALYTICS LOGGED</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#22d3ee' }}>{analytics.length}</div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '12px', borderRadius: '12px', color: '#c084fc' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>TOTAL GMV</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#c084fc' }}>
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Simulator + Event Architecture Visualizer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '20px', marginBottom: '28px' }}>
        
        {/* Order Event Simulator Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PlusCircle size={20} color="#818cf8" />
            <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Order Event Producer</h2>
          </div>

          {/* Presets */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              Quick Presets
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {presetProducts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => { setProductName(p.name); setAmount(p.price); }}
                  style={{
                    background: productName === p.name ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${productName === p.name ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                    color: productName === p.name ? '#fff' : '#94a3b8',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateOrder}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Product Name
              </label>
              <input 
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Amount (INR ₹)
              </label>
              <input 
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
                transition: 'all 0.2s'
              }}
            >
              <Zap size={16} />
              {loading ? 'Publishing Event...' : '🚀 Publish ORDER_CREATED Event'}
            </button>
          </form>

          {lastEvent && (
            <div style={{ marginTop: '16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: '600', marginBottom: '4px' }}>
                <CheckCircle2 size={14} />
                <span>Event Published at {lastEvent.time}</span>
              </div>
              <div style={{ color: '#94a3b8' }}>
                Order #{lastEvent.orderId} • {lastEvent.product} • ₹{lastEvent.amount}
              </div>
            </div>
          )}
        </div>

        {/* Live Architecture Flow Map */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#a855f7" />
                <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Live Event Choreography Pipeline</h2>
              </div>
              <span style={{ fontSize: '12px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                Kafka 4.0.0
              </span>
            </div>

            {/* Visual Node Diagram */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
              
              {/* Row 1: Order -> Kafka -> Payment */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: '8px' }}>
                
                {/* Node: Order Service */}
                <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid #6366f1', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase' }}>Service</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginTop: '2px' }}>Order Service</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>POST /api/orders</div>
                </div>

                <div style={{ color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={20} />
                </div>

                {/* Topic: order-events */}
                <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px dashed #f59e0b', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '700' }}>KAFKA TOPIC</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginTop: '2px' }}>order-events</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>ORDER_CREATED</div>
                </div>

                <div style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={20} />
                </div>

                {/* Node: Payment Service */}
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#34d399', fontWeight: '700', textTransform: 'uppercase' }}>Consumer + Service</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginTop: '2px' }}>Payment Service</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>group: payment-service</div>
                </div>

              </div>

              {/* Connecting Pipe */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4px 0' }}>
                <div style={{ width: '2px', height: '20px', background: 'linear-gradient(to bottom, #10b981, #a855f7)' }} />
              </div>

              {/* Row 2: Payment Topic -> Notification & Analytics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1.2fr', alignItems: 'center', gap: '12px' }}>
                
                {/* Topic: payment-events */}
                <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px dashed #a855f7', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#c084fc', fontWeight: '700' }}>KAFKA TOPIC (Fan-Out)</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginTop: '2px' }}>payment-events</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>PAYMENT_COMPLETED</div>
                </div>

                <div style={{ color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={20} />
                </div>

                {/* Parallel Consumers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Notification Service */}
                  <div style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid #f43f5e', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>Notification Service</div>
                      <div style={{ fontSize: '10px', color: '#fda4af' }}>group: notification-service</div>
                    </div>
                    <span style={{ fontSize: '11px', background: '#f43f5e', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>EMAIL</span>
                  </div>

                  {/* Analytics Service */}
                  <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid #06b6d4', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>Analytics Service</div>
                      <div style={{ fontSize: '10px', color: '#67e8f9' }}>group: analytics-service</div>
                    </div>
                    <span style={{ fontSize: '11px', background: '#06b6d4', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>METRICS</span>
                  </div>

                </div>

              </div>

            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '12px' }}>
            ⚡ Choreography Pattern: Loose coupling via event stream • Zero synchronous blocking
          </div>
        </div>

      </div>

      {/* Service Tables Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { id: 'all', label: 'All Services Grid', icon: Layers },
              { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
              { id: 'payments', label: `Payments (${payments.length})`, icon: CreditCard },
              { id: 'notifications', label: `Notifications (${notifications.length})`, icon: Bell },
              { id: 'analytics', label: `Analytics (${analytics.length})`, icon: BarChart3 },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                    border: `1px solid ${activeTab === tab.id ? 'rgba(99, 102, 241, 0.5)' : 'transparent'}`,
                    color: activeTab === tab.id ? '#fff' : '#94a3b8',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={fetchAllData}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#cbd5e1',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={13} />
            <span>Manual Refresh</span>
          </button>
        </div>

        {/* Dynamic Tables Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: activeTab === 'all' ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr', 
          gap: '20px' 
        }}>

          {/* Table 1: Orders */}
          {(activeTab === 'all' || activeTab === 'orders') && (
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(99, 102, 241, 0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={16} color="#818cf8" />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Orders Table</span>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '10px 14px' }}>ID</th>
                      <th style={{ padding: '10px 14px' }}>Product</th>
                      <th style={{ padding: '10px 14px' }}>Amount</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice().reverse().map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600', color: '#818cf8' }}>#{order.id}</td>
                        <td style={{ padding: '10px 14px', color: '#f8fafc' }}>{order.productName}</td>
                        <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>₹{order.amount?.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No orders yet. Publish one above!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Table 2: Payments */}
          {(activeTab === 'all' || activeTab === 'payments') && (
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(16, 185, 129, 0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} color="#34d399" />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Payments Table</span>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '10px 14px' }}>Payment ID</th>
                      <th style={{ padding: '10px 14px' }}>Order ID</th>
                      <th style={{ padding: '10px 14px' }}>Amount</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice().reverse().map(payment => (
                      <tr key={payment.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600', color: '#34d399' }}>PAY-{payment.id}</td>
                        <td style={{ padding: '10px 14px', color: '#818cf8', fontWeight: '600' }}>#{payment.orderId}</td>
                        <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>₹{payment.amount?.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No payments processed yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Table 3: Notifications */}
          {(activeTab === 'all' || activeTab === 'notifications') && (
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(244, 63, 94, 0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} color="#fb7185" />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Notifications Table</span>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '10px 14px' }}>ID</th>
                      <th style={{ padding: '10px 14px' }}>Order</th>
                      <th style={{ padding: '10px 14px' }}>Message</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.slice().reverse().map(notif => (
                      <tr key={notif.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600', color: '#fb7185' }}>NOTIF-{notif.id}</td>
                        <td style={{ padding: '10px 14px', color: '#818cf8', fontWeight: '600' }}>#{notif.orderId}</td>
                        <td style={{ padding: '10px 14px', color: '#f8fafc' }}>{notif.message}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                            {notif.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {notifications.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No notifications sent yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Table 4: Analytics */}
          {(activeTab === 'all' || activeTab === 'analytics') && (
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(6, 182, 212, 0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={16} color="#22d3ee" />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Analytics Table</span>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '10px 14px' }}>ID</th>
                      <th style={{ padding: '10px 14px' }}>Order</th>
                      <th style={{ padding: '10px 14px' }}>Event Type</th>
                      <th style={{ padding: '10px 14px' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.slice().reverse().map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600', color: '#22d3ee' }}>LOG-{item.id}</td>
                        <td style={{ padding: '10px 14px', color: '#818cf8', fontWeight: '600' }}>#{item.orderId}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                            {item.eventType}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}>
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Just now'}
                        </td>
                      </tr>
                    ))}
                    {analytics.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No analytics logged yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
