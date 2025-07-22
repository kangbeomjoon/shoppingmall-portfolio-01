'use client';

import { formatPrice } from '@/lib/utils';

const recentOrders = [
  {
    id: '1',
    customer: '김철수',
    email: 'kim@example.com',
    amount: 125000,
    status: 'processing',
  },
  {
    id: '2',
    customer: '이영희',
    email: 'lee@example.com',
    amount: 89000,
    status: 'completed',
  },
  {
    id: '3',
    customer: '박민수',
    email: 'park@example.com',
    amount: 234000,
    status: 'pending',
  },
  {
    id: '4',
    customer: '정수진',
    email: 'jung@example.com',
    amount: 56000,
    status: 'completed',
  },
];

const statusMap = {
  pending: { label: '대기중', className: 'text-yellow-600' },
  processing: { label: '처리중', className: 'text-blue-600' },
  completed: { label: '완료', className: 'text-green-600' },
  cancelled: { label: '취소', className: 'text-red-600' },
};

export function RecentOrders() {
  return (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-medium">{order.customer}</p>
            <p className="text-xs text-muted-foreground">{order.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">{formatPrice(order.amount)}</p>
            <span
              className={`text-xs font-medium ${
                statusMap[order.status as keyof typeof statusMap].className
              }`}
            >
              {statusMap[order.status as keyof typeof statusMap].label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}