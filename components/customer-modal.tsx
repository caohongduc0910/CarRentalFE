"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Customer } from "@/lib/mock-api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  onSave: (data: Partial<Customer>) => Promise<void>
}

export default function CustomerModal({ open, onOpenChange, customer, onSave }: CustomerModalProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    } else {
      setFormData({})
    }
  }, [customer, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSave(formData)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{customer ? "Sửa thông tin khách hàng" : "Thêm khách hàng mới"}</DialogTitle>
          <DialogDescription>Nhập hoặc cập nhật thông tin khách hàng</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Họ tên</label>
            <Input name="name" value={formData.name || ""} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Số điện thoại</label>
            <Input name="phone" value={formData.phone || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CCCD</label>
            <Input name="cccd" value={formData.cccd || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Địa chỉ</label>
            <Input name="address" value={formData.address || ""} onChange={handleChange} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
