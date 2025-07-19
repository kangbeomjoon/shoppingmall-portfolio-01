import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Store, 
  Users, 
  Mail, 
  Bell, 
  Shield,
  Palette,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          설정 관리
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          시스템 설정을 관리하고 사용자 경험을 개선하세요
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              매장 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">매장 이름</Label>
              <Input id="store-name" defaultValue="E-Shop" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-description">매장 설명</Label>
              <Input id="store-description" defaultValue="현대적인 온라인 쇼핑몰" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">연락처 이메일</Label>
              <Input id="store-email" type="email" defaultValue="contact@eshop.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-phone">연락처 전화번호</Label>
              <Input id="store-phone" defaultValue="02-1234-5678" />
            </div>
            <Button className="w-full">매장 설정 저장</Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              사용자 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registration">회원가입 허용</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="registration" defaultChecked />
                <Label htmlFor="registration" className="text-sm">
                  신규 사용자 회원가입 허용
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-verification">이메일 인증</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="email-verification" defaultChecked />
                <Label htmlFor="email-verification" className="text-sm">
                  회원가입 시 이메일 인증 필수
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-checkout">게스트 주문</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="guest-checkout" />
                <Label htmlFor="guest-checkout" className="text-sm">
                  비회원 주문 허용
                </Label>
              </div>
            </div>
            <Button className="w-full">사용자 설정 저장</Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              이메일 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-server">SMTP 서버</Label>
              <Input id="smtp-server" defaultValue="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP 포트</Label>
              <Input id="smtp-port" defaultValue="587" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-username">사용자명</Label>
              <Input id="smtp-username" defaultValue="noreply@eshop.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">비밀번호</Label>
              <Input id="smtp-password" type="password" />
            </div>
            <Button className="w-full">이메일 설정 저장</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-notifications">주문 알림</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="order-notifications" defaultChecked />
                <Label htmlFor="order-notifications" className="text-sm">
                  새 주문 알림 받기
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inventory-notifications">재고 알림</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="inventory-notifications" defaultChecked />
                <Label htmlFor="inventory-notifications" className="text-sm">
                  재고 부족 알림 받기
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-notifications">사용자 알림</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="user-notifications" />
                <Label htmlFor="user-notifications" className="text-sm">
                  신규 회원 알림 받기
                </Label>
              </div>
            </div>
            <Button className="w-full">알림 설정 저장</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              보안 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">세션 타임아웃 (분)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-login-attempts">최대 로그인 시도 횟수</Label>
              <Input id="max-login-attempts" type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-policy">비밀번호 정책</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="password-policy" defaultChecked />
                <Label htmlFor="password-policy" className="text-sm">
                  강력한 비밀번호 필수
                </Label>
              </div>
            </div>
            <Button className="w-full">보안 설정 저장</Button>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              테마 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-theme">기본 테마</Label>
              <select 
                id="default-theme" 
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="light">라이트</option>
                <option value="dark">다크</option>
                <option value="system">시스템</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-color">기본 색상</Label>
              <input 
                id="primary-color" 
                type="color" 
                defaultValue="#3B82F6"
                className="w-full h-10 border border-gray-300 rounded-md dark:border-gray-600"
              />
            </div>
            <Button className="w-full">테마 설정 저장</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}