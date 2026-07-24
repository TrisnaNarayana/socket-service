import React, { useState, useCallback } from 'react';
import { UserDTO } from '@vms/shared';
import { useWebSocket } from '../hooks/useWebSocket';
import { Sidebar, DashboardView } from './Sidebar';
import { Header } from './Header';
import { GlobalMonitorView } from './GlobalMonitorView';
import { MultiProjectGatewayView } from './MultiProjectGatewayView';
import { ApplicationsView } from './ApplicationsView';
import { ManualGuideView } from './ManualGuideView';
import { DashboardLog } from './LiveFeedPanel';

import { getWsUrl } from '../config/api.config';

interface DashboardPageProps {
  user: UserDTO;
  token: string;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, token, onLogout }) => {
  const { status, logs: wsLogs, sendMessage, reconnect } = useWebSocket(getWsUrl(), token);
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [activeRooms, setActiveRooms] = useState<string[]>([]);
  const [extraLogs, setExtraLogs] = useState<DashboardLog[]>([]);

  const handleAddLog = useCallback((type: DashboardLog['type'], message: string) => {
    const newLog: DashboardLog = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setExtraLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, []);

  const handleSubscribe = (room: string) => {
    sendMessage('subscribe', { projectId: 'demo', room });
    setActiveRooms((prev) => (prev.includes(room) ? prev : [...prev, room]));
    handleAddLog('system', `Sent SUBSCRIBE request for room "${room}"`);
  };

  const handleUnsubscribe = (room: string) => {
    sendMessage('unsubscribe', { projectId: 'demo', room });
    setActiveRooms((prev) => prev.filter((r) => r !== room));
    handleAddLog('system', `Sent UNSUBSCRIBE request for room "${room}"`);
  };

  const handleClearLogs = () => {
    setExtraLogs([]);
  };

  // Combine wsLogs and extraLogs sorted by timestamp
  const combinedLogs: DashboardLog[] = [
    ...extraLogs,
    ...wsLogs.map((l) => ({
      id: l.id,
      type: l.type as DashboardLog['type'],
      message: l.message,
      timestamp: l.timestamp,
    })),
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} onSelectView={setActiveView} />

      {/* Main Container */}
      <div className="main-content">
        {/* Header Bar */}
        <Header user={user} status={status} activeView={activeView} onLogout={onLogout} />

        {/* Dynamic View Content */}
        {activeView === 'overview' ? (
          <GlobalMonitorView
            status={status}
            logs={combinedLogs}
            onSendMessage={sendMessage}
            onClearLogs={handleClearLogs}
            onReconnect={reconnect}
          />
        ) : activeView === 'socket_gateway' ? (
          <MultiProjectGatewayView
            status={status}
            activeRooms={activeRooms}
            logs={combinedLogs}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
            onLog={handleAddLog}
            onClearLogs={handleClearLogs}
            onReconnect={reconnect}
          />
        ) : activeView === 'applications' ? (
          <ApplicationsView logs={combinedLogs} />
        ) : (
          <ManualGuideView />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
