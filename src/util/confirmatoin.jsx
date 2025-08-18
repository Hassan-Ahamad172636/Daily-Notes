import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card
        className="w-[90%] max-w-sm p-6 shadow-xl border border-white/30 
        bg-white/10 backdrop-blur-lg rounded-2xl transition-all"
      >
        <CardContent className="space-y-4 p-0">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm text-white/80">{message}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button className="cursor-pointer" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="cursor-pointer" variant="destructive" onClick={onConfirm}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfirmDialog
