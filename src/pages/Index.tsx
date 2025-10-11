import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface SearchResult {
  title: string;
  url: string;
}

type Language = 'en' | 'ru' | 'ar';

const translations = {
  en: {
    search: 'Search or enter URL',
    settings: 'Settings',
    incognito: 'Incognito Mode',
    adBlock: 'Ad Blocker',
    vpn: 'VPN (Canada)',
    language: 'Language',
    searchPlaceholder: 'Search the web or enter URL...',
  },
  ru: {
    search: 'Поиск или введите URL',
    settings: 'Настройки',
    incognito: 'Режим инкогнито',
    adBlock: 'Блокировка рекламы',
    vpn: 'VPN (Канада)',
    language: 'Язык',
    searchPlaceholder: 'Поиск в интернете или введите URL...',
  },
  ar: {
    search: 'البحث أو أدخل عنوان URL',
    settings: 'الإعدادات',
    incognito: 'وضع التصفح المتخفي',
    adBlock: 'حاجب الإعلانات',
    vpn: 'VPN (كندا)',
    language: 'اللغة',
    searchPlaceholder: 'ابحث في الويب أو أدخل عنوان URL...',
  },
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [incognito, setIncognito] = useState(false);
  const [adBlock, setAdBlock] = useState(false);
  const [vpn, setVpn] = useState(false);
  const [language, setLanguage] = useState<Language>('ru');

  const t = translations[language];

  const isUrl = (text: string) => {
    try {
      new URL(text.startsWith('http') ? text : `https://${text}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    if (isUrl(searchQuery)) {
      const url = searchQuery.startsWith('http') ? searchQuery : `https://${searchQuery}`;
      setCurrentUrl(url);
      setSearchResults([]);
    } else {
      const mockResults: SearchResult[] = [
        { title: searchQuery, url: 'https://wikipedia.org' },
        { title: `${searchQuery} - Википедия`, url: 'https://ru.wikipedia.org' },
        { title: `Купить ${searchQuery}`, url: 'https://amazon.com' },
        { title: `${searchQuery} инструкция`, url: 'https://youtube.com' },
      ];
      setSearchResults(mockResults);
      setCurrentUrl('');
    }
  };

  const handleResultClick = (url: string) => {
    setCurrentUrl(url);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
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
              className="bg-[#3b82f6] hover:bg-[#2563eb] h-12 px-6"
            >
              <Icon name="Search" size={20} />
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-[#2d2d2d]">
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
                      onClick={() => setLanguage('en')}
                      variant={language === 'en' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        language === 'en'
                          ? 'bg-[#3b82f6] hover:bg-[#2563eb]'
                          : 'hover:bg-[#2d2d2d]'
                      }`}
                    >
                      English
                    </Button>
                    <Button
                      onClick={() => setLanguage('ru')}
                      variant={language === 'ru' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        language === 'ru'
                          ? 'bg-[#3b82f6] hover:bg-[#2563eb]'
                          : 'hover:bg-[#2d2d2d]'
                      }`}
                    >
                      Русский
                    </Button>
                    <Button
                      onClick={() => setLanguage('ar')}
                      variant={language === 'ar' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        language === 'ar'
                          ? 'bg-[#3b82f6] hover:bg-[#2563eb]'
                          : 'hover:bg-[#2d2d2d]'
                      }`}
                    >
                      العربية
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {searchResults.length > 0 && (
          <div className="space-y-3 max-w-3xl mx-auto mt-8">
            {searchResults.map((result, index) => (
              <Card
                key={index}
                onClick={() => handleResultClick(result.url)}
                className="bg-[#2d2d2d] border-[#3d3d3d] p-4 cursor-pointer hover:bg-[#353535] transition-colors"
              >
                <h3 className="text-white font-medium text-lg mb-1">{result.title}</h3>
                <p className="text-gray-400 text-sm">{result.url}</p>
              </Card>
            ))}
          </div>
        )}

        {currentUrl && (
          <div className="mt-4 rounded-lg overflow-hidden border border-[#2d2d2d]">
            <div className="bg-[#2d2d2d] p-3 flex items-center gap-3">
              <Button
                onClick={() => setCurrentUrl('')}
                variant="ghost"
                size="icon"
                className="hover:bg-[#3d3d3d]"
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

        {!currentUrl && searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Icon name="Search" size={80} className="text-gray-700 mb-4" />
            <p className="text-gray-500 text-lg">{t.search}</p>
          </div>
        )}
      </main>
    </div>
  );
}
