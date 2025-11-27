'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-slate-700">
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={`cursor-pointer ${i18n.language === 'en' ? 'bg-purple-600/30 text-purple-300' : 'text-gray-300 hover:bg-slate-700'}`}
        >
          🇺🇸 {t('settings.english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('es')}
          className={`cursor-pointer ${i18n.language === 'es' ? 'bg-purple-600/30 text-purple-300' : 'text-gray-300 hover:bg-slate-700'}`}
        >
          🇪🇸 {t('settings.spanish')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}