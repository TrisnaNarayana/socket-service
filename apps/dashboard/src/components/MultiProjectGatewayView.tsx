import React from 'react';
import { ApiTesterPanel } from './ApiTesterPanel';
import { ConsumerSimPanel } from './ConsumerSimPanel';
import { LiveFeedPanel, DashboardLog } from './LiveFeedPanel';

interface MultiProjectGatewayViewProps {
  status: string;
  activeRooms: string[];
  logs: DashboardLog[];
  onSubscribe: (room: string) => void;
  onUnsubscribe: (room: string) => void;
  onLog: (type: DashboardLog['type'], message: string) => void;
  onClearLogs: () => void;
  onReconnect: () => void;
}

export const MultiProjectGatewayView: React.FC<MultiProjectGatewayViewProps> = ({
  status,
  activeRooms,
  logs,
  onSubscribe,
  onUnsubscribe,
  onLog,
  onClearLogs,
  onReconnect,
}) => {
  return (
    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
      {/* Left Column: API Publisher & WS Consumer Tester */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ApiTesterPanel onLog={onLog} />
        <ConsumerSimPanel
          status={status}
          activeRooms={activeRooms}
          onSubscribe={onSubscribe}
          onUnsubscribe={onUnsubscribe}
          onReconnect={onReconnect}
        />
      </div>

      {/* Right Column: Live Feed Stream */}
      <div>
        <LiveFeedPanel logs={logs} onClear={onClearLogs} />
      </div>
    </div>
  );
};
