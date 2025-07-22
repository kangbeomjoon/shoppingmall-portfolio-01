'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useCategories } from '@/hooks/use-categories';
import { CartDropdown } from './cart-dropdown';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const { totalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { data: categories } = useCategories();
  const cartDropdownRef = React.useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = React.useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { href: '/', label: '홈' },
    { href: '/products', label: '상품' },
    { href: '/categories', label: '카테고리' },
    { href: '/about', label: '소개' },
  ];

  return (
    <header className={cn('sticky top-0 z-50 border-b bg-background/95 backdrop-blur', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-bold">E</span>
            </div>
            <span className="hidden text-xl font-bold sm:inline-block">
              개발자들의 쇼핑몰
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              item.label === '카테고리' ? (
                <div key={item.href} className="relative" ref={categoriesDropdownRef}>
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {isCategoriesOpen && categories && (
                    <div className="absolute left-0 top-full mt-2 w-48 rounded-md bg-background border shadow-lg">
                      <div className="py-1">
                        <Link
                          href="/products"
                          className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          전체 상품
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            {category.name}
                            {category._count && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({category._count.products})
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="상품 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <div className="relative" ref={cartDropdownRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleCartClick}
              >
                <ShoppingCart className={cn(
                  "h-5 w-5 transition-colors",
                  totalItems > 0 && "text-primary"
                )} />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center transition-all duration-200"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>
              
              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 top-full mt-2 z-50">
                  <CartDropdown />
                </div>
              )}
            </div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="/avatars/01.png" alt="Profile" />
                    <AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="상품 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              {navItems.map((item) => (
                item.label === '카테고리' ? (
                  <div key={item.href}>
                    <div className="px-3 py-2 text-base font-medium">
                      카테고리
                    </div>
                    {categories && (
                      <div className="pl-6">
                        <Link
                          href="/products"
                          className="block px-3 py-1 text-sm transition-colors hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          전체 상품
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="block px-3 py-1 text-sm transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {category.name}
                            {category._count && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({category._count.products})
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}

              {/* Mobile Auth */}
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      프로필
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}