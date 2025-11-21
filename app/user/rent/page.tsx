"use client"

import type React from "react"

import { ProtectedLayout } from "@/components/protected-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { api, type Car, type Collateral } from "@/lib/mock-api"

export default function RentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cars, setCars] = useState<Car[]>([])
  const [collaterals, setCollaterals] = useState<Collateral[]>([])
  const [selectedCar, setSelectedCar] = useState("")
  const [selectedCollateral, setSelectedCollateral] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      const carsList = await api.cars.getList()
      const collateralsList = await api.collaterals.getList()
      setCars(carsList)
      setCollaterals(collateralsList)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (selectedCar && startDate && endDate) {
      const car = cars.find((c) => c.id.toString() === selectedCar)
      if (car) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        setEstimatedPrice(days * car.pricePerDay)
      }
    }
  }, [selectedCar, startDate, endDate, cars])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      await api.contracts.create({
        userId: user.id,
        carId: selectedCar,
        collateralId: selectedCollateral,
        startDate,
        endDate,
        estimatedPrice,
      })
      router.push("/user/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedLayout requiredRole="user">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Tạo hợp đồng thuê xe</h2>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Information */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Họ tên</label>
                <Input value={user?.name || ""} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Số điện thoại</label>
                <Input value={user?.phone || ""} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CCCD</label>
                <Input value={user?.cccd || ""} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Địa chỉ</label>
                <Input value={user?.address || ""} />
              </div>

              <hr className="my-6" />

              {/* Rental Information */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Chọn xe *</label>
                <Select value={selectedCar} onValueChange={setSelectedCar}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {cars.map((car) => (
                      <SelectItem key={car.id} value={car.id.toString()}>
                        {car.name} ({car.brand}) - {car.pricePerDay.toLocaleString()} VNĐ/ngày
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tài sản đảm bảo *</label>
                <Select value={selectedCollateral} onValueChange={setSelectedCollateral}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tài sản đảm bảo" />
                  </SelectTrigger>
                  <SelectContent>
                    {collaterals.map((collateral) => (
                      <SelectItem key={collateral.id} value={collateral.id.toString()}>
                        {collateral.name} ({collateral.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ngày bắt đầu *</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ngày kết thúc *</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>

              {estimatedPrice > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Giá ước tính</p>
                  <p className="text-2xl font-bold">{estimatedPrice.toLocaleString()} VNĐ</p>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !selectedCar || !selectedCollateral || !startDate || !endDate}
                >
                  {isLoading ? "Đang tạo..." : "Tạo hợp đồng"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
