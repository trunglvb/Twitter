import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t, i18n } = useTranslation()
  const currrentLanguage = i18n.language
  return (
    <div>
      <Button>Click me</Button>
      <span>{t('MY_OPEN_ISSUE')}</span>
    </div>
  )
}
