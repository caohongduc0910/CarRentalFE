"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Violation } from "@/lib/mock-api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ViolationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  violation: Violation | null
  onSave: (data: Omit<Violation, "id"> | Partial<Violation>) => Promise<void>
}

export default function ViolationModal({ open, onOpenChange, violation, onSave }: ViolationModalProps) {
  const [formData, setFormData] = useState<Omit<Violation, "id">>({
    name: "",
    price: 0,
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (violation) {
      setFormData({
        name: violation.name,
        price: violation.price,
        description: violation.description,
      })
    } else {
      setFormData({
        name: "",
        price: 0,
        description: "",
      })
    }
  }, [violation, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" ? Number(value) : value,
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
          <DialogTitle>{violation ? "Sửa lỗi phạt" : "Thêm lỗi phạt mới"}</DialogTitle>
          <DialogDescription>
            {violation ? "Cập nhật thông tin lỗi phạt" : "Nhập thông tin lỗi phạt mới"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên lỗi</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Giá phạt (VNĐ)</label>
            <Input name="price" type="number" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
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
