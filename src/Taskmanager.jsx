import React, { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

const TaskManager = () => {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("all");

  const [task, setTask] = useState([
    {
      id: 1,
      title: "Review project tasks",
      priority: "medium",
      status: "in-progress",
      dueDate: "2025-06-28",
    },
    {
      id: 2,
      title: "Prepare meeting agenda",
      priority: "high",
      status: "todo",
      dueDate: "2025-06-30",
    },
    {
      id: 3,
      title: "Submit project report",
      priority: "low",
      status: "completed",
      dueDate: "2025-06-25",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    priority: "low",
    dueDate: "",
    status: "todo",
  });

  useEffect(() => {
    const completedTasks = task.filter((t) => t.status === "completed").length;
    const inProgressTasks = task.filter(
      (t) => t.status === "in-progress"
    ).length;
    const overdueTasks = task.filter(
      (t) =>
        new Date(t.dueDate) < new Date() &&
        new Date(t.dueDate).toDateString() !== new Date().toDateString()
    ).length;

    setComplete(completedTasks);
    setProgress(inProgressTasks);
    setOverdue(overdueTasks);
    setTotal(task.length);
  }, [task]);

  const filteredTasks = task.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const toggleTaskStatus = (id) => {
    const statusOrder = ["todo", "in-progress", "completed"];
    setTask(
      task.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                statusOrder[(statusOrder.indexOf(t.status) + 1) % statusOrder.length],
            }
          : t
      )
    );
  };

  const addTask = () => {
    if (newTask.title.trim() === "") return;
    const newTaskItem = {
      id: Date.now(),
      title: newTask.title,
      priority: newTask.priority,
      status: "todo",
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
    };
    setTask([...task, newTaskItem]);
    setNewTask({ title: "", priority: "low", dueDate: "", status: "todo" });
  };

  const deleteTask = (id) => {
    setTask(task.filter((t) => t.id !== id));
  };

  const isOverdue = (dueDate) => {
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  return (
    <div className="bg-white w-full h-screen text-black flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-5xl font-bold mb-8">Task Dashboard</h1>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mb-10 w-full max-w-3xl">
        {[
          { label: "Total Tasks", value: total, color: "text-blue-800" },
          { label: "Complete", value: complete, color: "text-green-800" },
          { label: "In-progress", value: progress, color: "text-yellow-800" },
          { label: "Overdue", value: overdue, color: "text-red-800" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border-4 border-gray-400 p-4 rounded-lg shadow-lg"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{stat.label}</h2>
              <h2 className={`${stat.color} text-lg font-bold`}>
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Section */}
      <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Task</h2>
        <div className="flex flex-col gap-6">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mt-6 w-full max-w-3xl">
        <div className="flex gap-4 justify-center">
          {["all", "todo", "in-progress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md ${
                filter === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6 space-y-3 w-full max-w-3xl">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${getPriorityColor(
              t.priority
            )} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`font-medium ${
                    t.status === "completed"
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {t.title}
                </h3>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    t.status
                  )}`}
                >
                  {t.status.replace("-", " ")}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTaskStatus(t.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded-md"
                >
                  Toggle Status
                </button>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <div>
                <Clock size={14} /> Due:{" "}
                <span
                  className={
                    isOverdue(t.dueDate) && t.status !== "completed"
                      ? "text-red-600"
                      : ""
                  }
                >
                  {new Date(t.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks available.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
