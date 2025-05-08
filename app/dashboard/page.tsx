"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { CheckCircle, Clock, ListTodo, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { TaskList } from "@/components/task-list"

interface Task {
  id: string
  title: string
  description: string
  status: string
  dueDate: string
  assignedTo: string
  createdBy: string
}

interface DashboardData {
  assignedTasks: Task[]
  createdTasks: Task[]
  overdueTasks: Task[]
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getToken()
        const response = await fetch("/api/tasks/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (data.success) {
          setDashboardData(data.data)
        } else {
          toast({
            title: "Error",
            description: data.msg || "Failed to fetch dashboard data",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [getToken, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tasks and activities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? dashboardData.assignedTasks.length + dashboardData.createdTasks.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">All tasks assigned to you or created by you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData
                ? dashboardData.assignedTasks.filter((task) => task.status === "Completed").length +
                  dashboardData.createdTasks.filter((task) => task.status === "Completed").length
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Tasks that have been completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.overdueTasks.length || 0}</div>
            <p className="text-xs text-muted-foreground">Tasks that are past their due date</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
          <TabsTrigger value="created">Created by Me</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Assigned to Me</CardTitle>
              <CardDescription>Tasks that have been assigned to you by others</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.assignedTasks && dashboardData.assignedTasks.length > 0 ? (
                <TaskList tasks={dashboardData.assignedTasks} />
              ) : (
                <p className="text-muted-foreground">No tasks assigned to you</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="created" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Created by Me</CardTitle>
              <CardDescription>Tasks that you have created</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.createdTasks && dashboardData.createdTasks.length > 0 ? (
                <TaskList tasks={dashboardData.createdTasks} />
              ) : (
                <p className="text-muted-foreground">No tasks created by you</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Tasks</CardTitle>
              <CardDescription>Tasks that are past their due date</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.overdueTasks && dashboardData.overdueTasks.length > 0 ? (
                <TaskList tasks={dashboardData.overdueTasks} />
              ) : (
                <p className="text-muted-foreground">No overdue tasks</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
