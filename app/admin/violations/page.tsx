"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api, type Violation } from "@/lib/mock-api"
import ViolationModal from "@/components/violation-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Edit2, Plus } from "lucide-react"

export default function ViolationsPage() {
  const [violations, setViolations] = useState<Violation[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingViolation, setEditingViolation] = useState<Violation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadViolations = async () => {
    setIsLoading(true)
    try {
      const result = await api.violations.getList(page, limit)
      setViolations(result.data)
      setTotal(result.total)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadViolations()
  }, [page])

  const handleCreate = () => {
    setEditingViolation(null)
    setIsModalOpen(true)
  }

  const handleEdit = (violation: Violation) => {
    setEditingViolation(violation)
    setIsModalOpen(true)
  }

  const handleSave = async (data: Omit<Violation, "id"> | Partial<Violation>) => {
    if (editingViolation) {
      await api.violations.update(editingViolation.id, data)
    } else {
      await api.violations.create(data as Omit<Violation, "id">)
    }
    setEditingViolation(null)
    setIsModalOpen(false)
    loadViolations()
  }

  const handleDelete = async (id: string) => {
    await api.violations.delete(id)
    loadViolations()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <ProtectedLayout requiredRole="admin">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quản lí lỗi phạt</h2>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm lỗi phạt mới
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách lỗi phạt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên lỗi</TableHead>
                    <TableHead>Giá phạt</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations?.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell className="font-medium">{violation.name}</TableCell>
                      <TableCell>{violation.price.toLocaleString()} VNĐ</TableCell>
                      <TableCell className="max-w-xs truncate">{violation.description}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(violation)}>
                          <Edit2 className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc muốn xóa lỗi phạt này? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                            <div className="flex gap-2 justify-end">
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(violation.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Xóa
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
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
          </CardContent>
        </Card>

        <ViolationModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          violation={editingViolation}
          onSave={handleSave}
        />
      </div>
    </ProtectedLayout>
  )
}
