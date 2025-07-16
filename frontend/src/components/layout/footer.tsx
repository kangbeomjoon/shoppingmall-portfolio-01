import * as React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Github, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: '회사소개', href: '/about' },
      { name: '채용정보', href: '/careers' },
      { name: '투자정보', href: '/investor' },
      { name: '공지사항', href: '/notices' },
    ],
    service: [
      { name: '고객센터', href: '/support' },
      { name: '배송정보', href: '/shipping' },
      { name: '교환/반품', href: '/returns' },
      { name: 'FAQ', href: '/faq' },
    ],
    policy: [
      { name: '이용약관', href: '/terms' },
      { name: '개인정보처리방침', href: '/privacy' },
      { name: '쿠키정책', href: '/cookies' },
      { name: '사업자정보', href: '/business' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <footer className={cn('bg-muted/50 border-t', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">E</span>
                </div>
                <span className="text-xl font-bold">E-Shop</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                현대적이고 안전한 온라인 쇼핑 경험을 제공하는 이커머스 플랫폼입니다.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold mb-4">회사</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Links */}
            <div>
              <h3 className="text-sm font-semibold mb-4">서비스</h3>
              <ul className="space-y-2">
                {footerLinks.service.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold mb-4">연락처</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>1588-1234</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>support@eshop.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>서울시 강남구 테헤란로 123</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {footerLinks.policy.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              © {currentYear} E-Shop. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}