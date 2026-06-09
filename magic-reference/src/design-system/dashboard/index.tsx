import React from 'react';
import { Card, Badge } from '../primitives';
import { MetricItem } from '../demo/mockData';

export function MetricCard({ item }: { item: MetricItem }) {
  return (
    <Card>
      <div className="vc-kpi">
        <span className="vc-kpi__label">{item.label}</span>
        <strong className="vc-kpi__value">{item.value}</strong>
        {item.delta ? <span className="vc-kpi__delta">{item.delta}</span> : null}
      </div>
    </Card>
  );
}

export function SummaryStrip({ items }: { items: MetricItem[] }) {
  return (
    <div className="vc-metrics">
      {items.map((item) => <MetricCard key={item.label} item={item} />)}
    </div>
  );
}

export function ChartCard() {
  return (
    <Card>
      <div className="vc-section-header">
        <div>
          <h3>Revenue cockpit</h3>
          <p>Biểu đồ minh họa phong cách chart card cho báo cáo và dashboard.</p>
        </div>
        <Badge tone="accent">Mock only</Badge>
      </div>
      <div style={{ display: 'grid', gap: 14 }}>
        {[72, 88, 56, 94, 68, 82].map((v, idx) => (
          <div key={idx} style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--vc-text-soft)' }}>
              <span>Tháng {idx + 1}</span>
              <span>{v}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(18,45,37,0.08)', overflow: 'hidden' }}>
              <div style={{ width: `${v}%`, height: '100%', background: 'linear-gradient(90deg, var(--vc-accent), #8bcbb9)' }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
