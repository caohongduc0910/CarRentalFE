"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Edit2 } from "lucide-react"
import { api } from "@/lib/mock-api"
import UserModal from "@/components/customer-modal"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const result = await api.users.getList(page, limit)
      setUsers(result.data)
      setTotal(result.total)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [page])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleSave = async (data: Partial<User>) => {
    if (editingUser) {
      await api.users.update(editingUser.id, data)
      setEditingUser(null)
    }
    setIsModalOpen(false)
    loadUsers()
  }

  const handleDelete = async (id: string) => {
    await api.users.delete(id)
    loadUsers()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <ProtectedLayout requiredRole="admin">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>CCCD</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.cccd}</TableCell>
                      <TableCell>{user.address}</TableCell>

                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
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
                              Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>

                            <div className="flex gap-2 justify-end">
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.id)}
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

        <UserModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          user={editingUser}
          onSave={handleSave}
        />
      </div>
    </ProtectedLayout>
  )
}
