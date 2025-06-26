import React, { useEffect, useState } from "react";
import {
  Clock,
  AlertCircle,
  Plus,
  CheckCircle2,
  Play,
  Pause,
  Trash2,
  Calendar,
  TrendingUp,
} from "lucide-react";

const TaskManager = () => {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("all");
  const [showAddTask, setShowAddTask] = useState(false);

  // Load tasks from localStorage or use default tasks
  const [task, setTask] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
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
        ];
  });

  const [newTask, setNewTask] = useState({
    title: "",
    priority: "low",
    dueDate: "",
    status: "todo",
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(task));
    
    const completedTasks = task.filter((t) => t.status === "completed").length;
    const inProgressTasks = task.filter(
      (t) => t.status === "in-progress"
    ).length;
    const overdueTasks = task.filter(
      (t) =>
        new Date(t.dueDate) < new Date() &&
        new Date(t.dueDate).toDateString() !== new Date().toDateString() &&
        t.status !== "completed"
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
    setShowAddTask(false);
  };

  const deleteTask = (id) => {
    setTask(task.filter((t) => t.id !== id));
  };

  const toggleTaskStatus = (id) => {
    const statusOrder = ["todo", "in-progress", "completed"];
    setTask(
      task.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                statusOrder[
                  (statusOrder.indexOf(t.status) + 1) % statusOrder.length
                ],
            }
          : t
      )
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "in-progress":
        return <Play className="w-4 h-4 text-blue-600" />;
      default:
        return <Pause className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "in-progress":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getPriorityColor = (status) => {
    switch (status) {
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

  const isOverdue = (dueDate) => {
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  const completionPercentage =
    total > 0 ? Math.round((complete / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Task Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Streamline your productivity with our intelligent task management
            system
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                Overall Progress
              </h2>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {completionPercentage}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Task Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            {
              label: "Total",
              value: total,
              color: "from-blue-500 to-blue-600",
              icon: Calendar,
              bgColor: "bg-blue-50",
            },
            {
              label: "Complete",
              value: complete,
              color: "from-emerald-500 to-emerald-600",
              icon: CheckCircle2,
              bgColor: "bg-emerald-50",
            },
            {
              label: "In Progress",
              value: progress,
              color: "from-amber-500 to-amber-600",
              icon: Play,
              bgColor: "bg-amber-50",
            },
            {
              label: "Overdue",
              value: overdue,
              color: "from-red-500 to-red-600",
              icon: AlertCircle,
              bgColor: "bg-red-50",
            },
          ].map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3 sm:mb-4`}
                >
                  <IconComponent className="w-6 h-6 text-gray-700" />
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { key: "all", label: "All Tasks", icon: Calendar },
              { key: "todo", label: "To Do", icon: Pause },
              { key: "in-progress", label: "In Progress", icon: Play },
              { key: "completed", label: "Completed", icon: CheckCircle2 },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm sm:text-base whitespace-nowrap transition-all ${
                    filter === item.key
                      ? "bg-white shadow-md border border-gray-200"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Task
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {filter === "all"
                ? "All Tasks"
                : filter === "todo"
                ? "To Do"
                : filter === "in-progress"
                ? "In Progress"
                : "Completed"}{" "}
              ({filteredTasks.length})
            </h3>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-1">
                No tasks found
              </h4>
              <p className="text-gray-500 text-sm">
                {filter === "all"
                  ? "Add your first task to get started"
                  : `No ${filter} tasks found`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-5 rounded-xl border-l-4 ${getPriorityColor(
                    t.priority
                  )} bg-white shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskStatus(t.id)}
                        className={`mt-1 p-2 rounded-lg ${getStatusColor(
                          t.status
                        )}`}
                      >
                        {getStatusIcon(t.status)}
                      </button>
                      <div>
                        <h4 className="font-medium text-gray-800">{t.title}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <div
                            className={`text-xs px-2 py-1 rounded ${getStatusColor(
                              t.status
                            )}`}
                          >
                            {t.status === "completed"
                              ? "Completed"
                              : t.status === "in-progress"
                              ? "In Progress"
                              : "To Do"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(t.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            {isOverdue(t.dueDate) && t.status !== "completed" && (
                              <span className="flex items-center gap-1 text-red-500 ml-2">
                                <AlertCircle className="w-3 h-3" />
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;