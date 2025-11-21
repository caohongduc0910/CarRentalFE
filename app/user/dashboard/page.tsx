"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { api, type Contract } from "@/lib/mock-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default function UserDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  const loadContracts = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const result = await api.contracts.getList(user.id, page, limit)
      setContracts(result.data)
      setTotal(result.total)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadContracts()
  }, [page, user])

  const totalPages = Math.ceil(total / limit)

  return (
    <ProtectedLayout requiredRole="user">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Thuê xe trực tuyến</h2>
          <Button onClick={() => router.push("/user/rent")}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo hợp đồng mới
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách hợp đồng của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Bạn chưa có hợp đồng nào. Hãy tạo hợp đồng mới!</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Hợp đồng</TableHead>
                        <TableHead>Xe</TableHead>
                        <TableHead>Tài sản đảm bảo</TableHead>
                        <TableHead>Ngày bắt đầu</TableHead>
                        <TableHead>Ngày kết thúc</TableHead>
                        <TableHead>Giá ước tính</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>{contract.id}</TableCell>
                          <TableCell>{contract?.car?.name}</TableCell>
                          <TableCell>{contract?.collateral?.name}</TableCell>
                          <TableCell>{new Date(contract.startDate).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell>{new Date(contract.endDate).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell>{contract.estimatedPrice.toLocaleString()} VNĐ</TableCell>
                          <TableCell>{new Date(contract.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages} (Tổng: {total})
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || isLoading}
                    >
                      Trang trước
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages || isLoading}
                    >
                      Trang sau
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
