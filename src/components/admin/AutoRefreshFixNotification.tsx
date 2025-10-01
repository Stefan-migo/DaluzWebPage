'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, X, Info } from 'lucide-react'

export function AutoRefreshFixNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has seen this notification
    const hasSeenNotification = localStorage.getItem('admin-refresh-fix-seen')
    if (!hasSeenNotification && !isDismissed) {
      setIsVisible(true)
    }
  }, [isDismissed])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('admin-refresh-fix-seen', 'true')
  }

  if (!isVisible) return null

  return (
    <Card className="mb-6 border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800 mb-1">
              🎉 Problema de Auto-Refresh Solucionado
            </h3>
            <div className="text-sm text-green-700 space-y-2">
              <p>
                <strong>Se han aplicado las siguientes mejoras:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>✅ <strong>Prevención de re-verificaciones innecesarias</strong> durante la actualización automática de tokens</li>
                <li>✅ <strong>Protección automática de formularios</strong> contra pérdida de datos</li>
                <li>✅ <strong>Optimización de dependencias</strong> en la autenticación de administrador</li>
                <li>✅ <strong>Indicadores visuales</strong> para cambios sin guardar</li>
              </ul>
              <p className="mt-2">
                <Info className="h-4 w-4 inline mr-1" />
                <strong>Ahora puedes:</strong> Llenar formularios sin preocuparte por perder datos debido a refreshes automáticos.
                El sistema protegerá automáticamente tu trabajo y te avisará antes de cualquier navegación accidental.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
