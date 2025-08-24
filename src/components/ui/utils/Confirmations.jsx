import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import React from 'react'
import { DialogFooter, DialogHeader } from '../dialog'
import { Button } from '../button'

function Confirmations() {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white text-lg font-semibold">
                        <XCircle className="w-5 h-5 text-red-400" />
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <p className="text-slate-300 text-sm mt-2">{message}</p>

                <DialogFooter className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        className="cursor-pointer bg-slate-600 hover:bg-slate-700 text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                    >
                        Yes, Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Confirmations