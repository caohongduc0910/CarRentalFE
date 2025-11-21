"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()

  return (
    <ProtectedLayout requiredRole="admin">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quản lí khách hàng</h3>
            <p className="text-muted-foreground mb-4">Quản lý danh sách khách hàng, sửa và xóa thông tin</p>
            <Button onClick={() => router.push("/admin/customers")}>Vào trang quản lí</Button>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quản lí lỗi phạt</h3>
            <p className="text-muted-foreground mb-4">Quản lý danh sách lỗi phạt, tạo, sửa và xóa</p>
            <Button onClick={() => router.push("/admin/violations")}>Vào trang quản lí</Button>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
