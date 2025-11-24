"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { User } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSave: (data: Partial<User>) => Promise<void>
}

export default function UserModal({ open, onOpenChange, user, onSave }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({})
    }
  }, [user, open])

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
          <DialogTitle>{user ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}</DialogTitle>
          <DialogDescription>Nhập hoặc cập nhật thông tin người dùng</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Họ tên</label>
            <Input name="name" value={formData.name || ""} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input name="email" value={formData.email || ""} onChange={handleChange} />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Số điện thoại</label>
            <Input name="phone" value={formData.phone || ""} onChange={handleChange} />
          </div>

          {/* CCCD */}
          <div className="space-y-2">
            <label className="text-sm font-medium">CCCD</label>
            <Input name="cccd" value={formData.cccd || ""} onChange={handleChange} />
          </div>

          {/* Address */}
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
