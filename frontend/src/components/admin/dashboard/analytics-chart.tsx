'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar } from 'lucide-react';

// Mock data for the chart
const chartData = [
  { date: '2024-01-01', sales: 4500, orders: 32 },
  { date: '2024-01-02', sales: 3200, orders: 24 },
  { date: '2024-01-03', sales: 5800, orders: 41 },
  { date: '2024-01-04', sales: 4200, orders: 29 },
  { date: '2024-01-05', sales: 6100, orders: 45 },
  { date: '2024-01-06', sales: 3800, orders: 28 },
  { date: '2024-01-07', sales: 7200, orders: 52 },
];

export function AnalyticsChart() {
  const maxSales = Math.max(...chartData.map(d => d.sales));
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">매출 분석</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              지난 7일
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Area */}
          <div className="h-48 relative">
            <div className="absolute inset-0 flex items-end justify-between space-x-1">
              {chartData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-100 dark:bg-blue-900/20 rounded-t-sm relative group cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                  style={{
                    height: `${(data.sales / maxSales) * 100}%`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ₩{data.sales.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            {chartData.map((data, index) => (
              <span key={index}>
                {new Date(data.date).toLocaleDateString('ko-KR', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            ))}
          </div>
          
          {/* Summary */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                평균 매출
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              ₩{(chartData.reduce((sum, d) => sum + d.sales, 0) / chartData.length).toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                총 주문 수
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {chartData.reduce((sum, d) => sum + d.orders, 0)}건
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}