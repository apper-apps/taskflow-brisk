import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast, isFuture } from 'date-fns'
import ApperIcon from './ApperIcon'
import { taskService, categoryService } from '../services'

const MainFeature = ({ tasks, setTasks, loading, error, searchTerm }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: ''
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryService.getAll()
        setCategories(result || [])
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  const filteredTasks = tasks?.filter(task => {
    const matchesCategory = selectedCategory === 'all' || task?.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'completed' && task?.completed) ||
      (selectedStatus === 'active' && !task?.completed)
    return matchesCategory && matchesStatus
  }) || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.id, {
          ...formData,
          completed: editingTask.completed,
          createdAt: editingTask.createdAt,
          completedAt: editingTask.completedAt
        })
        setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task))
        toast.success('Task updated successfully!')
        setEditingTask(null)
      } else {
        const newTask = await taskService.create({
          ...formData,
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        })
        setTasks(prev => [...prev, newTask])
        toast.success('Task created successfully!')
      }
      
      setFormData({ title: '', description: '', dueDate: '', priority: 'medium', category: '' })
      setShowAddForm(false)
    } catch (err) {
      toast.error('Failed to save task')
    }
  }

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      })
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task marked as active')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      toast.success('Task deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'medium',
      category: task.category || ''
    })
    setShowAddForm(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-surface-400'
    }
  }

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-surface-500'
    const date = new Date(dueDate)
    if (isPast(date) && !isToday(date)) return 'text-red-500'
    if (isToday(date)) return 'text-orange-500'
    return 'text-surface-600 dark:text-surface-400'
  }

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || '#6B7280'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-soft border border-white/20 dark:border-surface-700/20 sticky top-24">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Filters</h3>
          
          {/* Status Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Status</h4>
            <div className="space-y-2">
              {[
                { key: 'all', label: 'All Tasks', count: tasks?.length || 0 },
                { key: 'active', label: 'Active', count: tasks?.filter(t => !t?.completed)?.length || 0 },
                { key: 'completed', label: 'Completed', count: tasks?.filter(t => t?.completed)?.length || 0 }
              ].map(status => (
                <button
                  key={status.key}
                  onClick={() => setSelectedStatus(status.key)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    selectedStatus === status.key
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <span>{status.label}</span>
                  <span className="text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
                    {status.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Categories</h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                }`}
              >
                <span>All Categories</span>
                <span className="text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
                  {tasks?.length || 0}
                </span>
              </button>
              {categories?.map(category => {
                const categoryTasks = tasks?.filter(t => t?.category === category?.name)?.length || 0
                return (
                  <button
                    key={category?.id}
                    onClick={() => setSelectedCategory(category?.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category?.name
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <span>{category?.name}</span>
                    </div>
                    <span className="text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
                      {categoryTasks}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Quick Add Bar */}
        <div className="mb-6">
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full p-4 bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl shadow-soft border border-white/20 dark:border-surface-700/20 hover:shadow-card transition-all duration-200 group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-center space-x-3 text-surface-600 dark:text-surface-400 group-hover:text-primary">
              <ApperIcon name="Plus" className="h-5 w-5" />
              <span className="font-medium">Add new task</span>
            </div>
          </motion.button>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-soft border border-white/20 dark:border-surface-700/20"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Task title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white placeholder-surface-500"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white placeholder-surface-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full p-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full p-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full p-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white"
                      >
                        <option value="">Select category</option>
                        {categories?.map(category => (
                          <option key={category?.id} value={category?.name}>
                            {category?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingTask(null)
                        setFormData({ title: '', description: '', dueDate: '', priority: 'medium', category: '' })
                      }}
                      className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                    >
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTasks?.length > 0 ? (
              filteredTasks.map(task => (
                <motion.div
                  key={task?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-soft border border-white/20 dark:border-surface-700/20 hover:shadow-card transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => handleToggleComplete(task?.id)}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        task?.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-surface-300 dark:border-surface-600 hover:border-green-500'
                      }`}
                    >
                      {task?.completed && (
                        <ApperIcon name="Check" className="h-3 w-3 text-white" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-medium transition-all ${
                            task?.completed
                              ? 'text-surface-500 dark:text-surface-400 line-through'
                              : 'text-surface-900 dark:text-white'
                          }`}>
                            {task?.title}
                          </h3>
                          {task?.description && (
                            <p className={`mt-1 text-sm transition-all ${
                              task?.completed
                                ? 'text-surface-400 dark:text-surface-500'
                                : 'text-surface-600 dark:text-surface-400'
                            }`}>
                              {task?.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task?.priority)}`} />
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-1 text-surface-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ApperIcon name="Edit2" className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(task?.id)}
                            className="p-1 text-surface-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-3">
                          {task?.dueDate && (
                            <div className={`flex items-center space-x-1 text-sm ${getDueDateColor(task?.dueDate)}`}>
                              <ApperIcon name="Calendar" className="h-4 w-4" />
                              <span>{format(new Date(task?.dueDate), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                          {task?.category && (
                            <div className="flex items-center space-x-1">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getCategoryColor(task?.category) }}
                              />
                              <span className="text-sm text-surface-600 dark:text-surface-400">
                                {task?.category}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <span className="text-xs text-surface-500 dark:text-surface-400 capitalize">
                          {task?.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-8 shadow-soft border border-white/20 dark:border-surface-700/20">
                  <ApperIcon name="CheckSquare" className="h-16 w-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                    {searchTerm ? 'No tasks found' : 'No tasks yet'}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-6">
                    {searchTerm 
                      ? `No tasks match "${searchTerm}". Try adjusting your search.`
                      : 'Create your first task to get started with TaskFlow.'
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                    >
                      <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                      Add Your First Task
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default MainFeature