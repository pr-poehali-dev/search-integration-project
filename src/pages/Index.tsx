import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

type Language = 'en' | 'ru' | 'ar';

const translations = {
  en: {
    search: 'Enter website URL',
    settings: 'Settings',
    incognito: 'Incognito Mode',
    adBlock: 'Ad Blocker',
    vpn: 'VPN (Canada)',
    language: 'Language',
    searchPlaceholder: 'Enter URL (e.g., google.com or https://example.com)...',
  },
  ru: {
    search: 'Введите URL сайта',
    settings: 'Настройки',
    incognito: 'Режим инкогнито',
    adBlock: 'Блокировка рекламы',
    vpn: 'VPN (Канада)',
    language: 'Язык',
    searchPlaceholder: 'Введите URL (например, google.com или https://example.com)...',
  },
  ar: {
    search: 'أدخل عنوان URL للموقع',
    settings: 'الإعدادات',
    incognito: 'وضع التصفح المتخفي',
    adBlock: 'حاجب الإعلانات',
    vpn: 'VPN (كندا)',
    language: 'اللغة',
    searchPlaceholder: 'أدخل عنوان URL (مثل google.com أو https://example.com)...',
  },
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [incognito, setIncognito] = useState(false);
  const [adBlock, setAdBlock] = useState(false);
  const [vpn, setVpn] = useState(false);
  const [language, setLanguage] = useState<Language>('ru');
  const [showIframe, setShowIframe] = useState(false);

  const t = translations[language];

  const playClickSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  useEffect(() => {
    if (currentUrl) {
      setShowIframe(true);
    } else {
      setShowIframe(false);
    }
  }, [currentUrl]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    playClickSound();
    
    let url = searchQuery.trim();
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    setCurrentUrl(url);
  };

  const handleClose = () => {
    playClickSound();
    setShowIframe(false);
    setTimeout(() => setCurrentUrl(''), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] text-white flex flex-col">
      <header className="border-b border-[#2d2d2d] bg-[#1a1a1a] sticky top-0 z-50">
        <div className="flex items-center gap-3 p-4 max-w-7xl mx-auto">
          <div className="flex-1 flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.searchPlaceholder}
              className="bg-[#2d2d2d] border-[#3d3d3d] text-white placeholder:text-gray-500 h-12"
            />
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] hover:from-[#2563eb] hover:to-[#7c3aed] h-12 px-6 transition-all duration-300 active:scale-95"
            >
              <Icon name="Globe" size={20} />
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gradient-to-r hover:from-[#3b82f6]/20 hover:to-[#8b5cf6]/20 transition-all duration-300 active:scale-95"
                onClick={playClickSound}
              >
                <Icon name="Settings" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#1a1a1a] border-[#2d2d2d] text-white">
              <SheetHeader>
                <SheetTitle className="text-white">{t.settings}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="EyeOff" size={20} />
                    <Label htmlFor="incognito" className="text-white cursor-pointer">
                      {t.incognito}
                    </Label>
                  </div>
                  <Switch
                    id="incognito"
                    checked={incognito}
                    onCheckedChange={setIncognito}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="ShieldCheck" size={20} />
                    <Label htmlFor="adblock" className="text-white cursor-pointer">
                      {t.adBlock}
                    </Label>
                  </div>
                  <Switch
                    id="adblock"
                    checked={adBlock}
                    onCheckedChange={setAdBlock}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="Globe" size={20} />
                    <Label htmlFor="vpn" className="text-white cursor-pointer">
                      {t.vpn}
                    </Label>
                  </div>
                  <Switch
                    id="vpn"
                    checked={vpn}
                    onCheckedChange={setVpn}
                  />
                </div>

                <div>
                  <Label className="text-white mb-3 block">{t.language}</Label>
                  <div className="space-y-2">
                    <Button
                      onClick={() => { playClickSound(); setLanguage('en'); }}
                      variant={language === 'en' ? 'default' : 'ghost'}
                      className={`w-full justify-start gap-3 transition-all duration-300 active:scale-95 ${
                        language === 'en'
                          ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] hover:from-[#2563eb] hover:to-[#7c3aed]'
                          : 'hover:bg-gradient-to-r hover:from-[#3b82f6]/20 hover:to-[#8b5cf6]/20'
                      }`}
                    >
                      <span className="text-2xl">🇺🇸</span>
                      <span>English</span>
                    </Button>
                    <Button
                      onClick={() => { playClickSound(); setLanguage('ru'); }}
                      variant={language === 'ru' ? 'default' : 'ghost'}
                      className={`w-full justify-start gap-3 transition-all duration-300 active:scale-95 ${
                        language === 'ru'
                          ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] hover:from-[#2563eb] hover:to-[#7c3aed]'
                          : 'hover:bg-gradient-to-r hover:from-[#3b82f6]/20 hover:to-[#8b5cf6]/20'
                      }`}
                    >
                      <span className="text-2xl">🇷🇺</span>
                      <span>Русский</span>
                    </Button>
                    <Button
                      onClick={() => { playClickSound(); setLanguage('ar'); }}
                      variant={language === 'ar' ? 'default' : 'ghost'}
                      className={`w-full justify-start gap-3 transition-all duration-300 active:scale-95 ${
                        language === 'ar'
                          ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] hover:from-[#2563eb] hover:to-[#7c3aed]'
                          : 'hover:bg-gradient-to-r hover:from-[#3b82f6]/20 hover:to-[#8b5cf6]/20'
                      }`}
                    >
                      <span className="text-2xl">🇸🇦</span>
                      <span>العربية</span>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {currentUrl && (
          <div className={`mt-4 rounded-lg overflow-hidden border border-[#2d2d2d] transition-all duration-300 ${
            showIframe ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="bg-gradient-to-r from-[#2d2d2d] to-[#3d3d3d] p-3 flex items-center gap-3">
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300 active:scale-95"
              >
                <Icon name="X" size={20} />
              </Button>
              <span className="text-sm text-gray-400">{currentUrl}</span>
            </div>
            <iframe
              src={currentUrl}
              className="w-full bg-white"
              style={{ height: 'calc(100vh - 200px)' }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title="Browser Frame"
            />
          </div>
        )}

        {!currentUrl && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent animate-pulse">anonykeys</h1>
            <Icon name="Globe" size={80} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">{t.search}</p>
          </div>
        )}
      </main>
    </div>
  );
}