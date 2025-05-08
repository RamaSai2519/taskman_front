"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, Edit } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Task {
  _id: string
  title: string
  description?: string
  priority: string
  status: string
  dueDate?: string
}

interface TaskListProps {
  tasks: Task[]
  onTaskUpdated?: () => void
}

export function TaskList({ tasks, onTaskUpdated }: TaskListProps) {
  const { getToken } = useAuth()
  const { toast } = useToast()

  const handleStatusChange = async (taskId: string, completed: boolean) => {
    try {
      const token = getToken()
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: completed ? "Completed" : "Pending",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Task marked as ${completed ? "completed" : "pending"}`,
        })
        if (onTaskUpdated) {
          onTaskUpdated()
        }
      } else {
        toast({
          title: "Error",
          description: data.msg || "Failed to update task status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating task status",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 hover:bg-red-600"
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 hover:bg-green-600"
      case "In Progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy")
  }

  const isOverdue = (dateString: string, status: string) => {
    if (!dateString || status === "Completed") return false
    const dueDate = new Date(dateString)
    const today = new Date()
    return dueDate < today
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task._id} className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                id={`task-${task._id}`}
                checked={task.status === "Completed"}
                onCheckedChange={(checked) => {
                  handleStatusChange(task._id, checked as boolean)
                }}
              />
              <div className="space-y-1">
                <div className="font-medium">{task.title}</div>
                {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  {task.dueDate && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className={isOverdue(task.dueDate, task.status) ? "text-red-500 font-medium" : ""}>
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate, task.status) && " (Overdue)"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/tasks/${task._id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
