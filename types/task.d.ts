interface Task {
  _id: string
  title: string
  description?: string
  dueDate?: string
  priority: "Low" | "Medium" | "High"
  status: "Pending" | "In Progress" | "Completed"
  assignedTo?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}
