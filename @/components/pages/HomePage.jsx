import { useState, useEffect } from 'react'
      import { motion } from 'framer-motion'
      import { toast } from 'react-toastify'
      import { taskService } from '@/services'
      import Header from '@/components/organisms/Header'
      import ProgressCard from '@/components/organisms/ProgressCard'
      import TaskSidebar from '@/components/organisms/TaskSidebar'
      import AddTaskForm from '@/components/organisms/AddTaskForm'
      import TaskList from '@/components/organisms/TaskList'
      import NoTasksMessage from '@/components/organisms/NoTasksMessage'
      import Icon from '@/components/atoms/Icon'
      
      const HomePage = ({ darkMode, setDarkMode }) => {
        const [tasks, setTasks] = useState([])
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(null)
        const [searchTerm, setSearchTerm] = useState('')
        const [showAddForm, setShowAddForm] = useState(false)
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
          const loadTasks = async () => {
            setLoading(true)
            try {
              const result = await taskService.getAll()
              setTasks(result || [])
            } catch (err) {
              setError(err.message)
            } finally {
              setLoading(false)
            }
          }
          loadTasks()
        }, [])
      
        const completedTasks = tasks?.filter(task => task?.completed)?.length || 0
        const totalTasks = tasks?.length || 0
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      
        const filteredBySearchTasks = tasks?.filter(task =>
          task?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
          task?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '')
        ) || []
      
        const filteredTasks = filteredBySearchTasks?.filter(task => {
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
              <Icon name="AlertCircle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )
        }
      
        return (
          <div className="min-h-screen bg-gradient-to-br from-surface-50 via-blue-50 to-purple-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
            <Header
              completionPercentage={completionPercentage}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            <ProgressCard
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              completionPercentage={completionPercentage}
            />
      
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <TaskSidebar
                  tasks={tasks}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                />
      
                <div className="lg:col-span-3">
                  <div className="mb-6">
                    <motion.button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="w-full p-4 bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl shadow-soft border border-white/20 dark:border-surface-700/20 hover:shadow-card transition-all duration-200 group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-center space-x-3 text-surface-600 dark:text-surface-400 group-hover:text-primary">
                        <Icon name="Plus" className="h-5 w-5" />
                        <span className="font-medium">Add new task</span>
                      </div>
                    </motion.button>
      
                    <AddTaskForm
                      showAddForm={showAddForm}
                      setShowAddForm={setShowAddForm}
                      formData={formData}
                      setFormData={setFormData}
                      categories={[]} {/* Categories are fetched in TaskSidebar now */}
                      handleSubmit={handleSubmit}
                      editingTask={editingTask}
                      setEditingTask={setEditingTask}
                    />
                  </div>
      
                  {filteredTasks?.length > 0 ? (
                    <TaskList
                      tasks={filteredTasks}
                      categories={[]} {/* Categories are passed to TaskList directly */}
                      handleToggleComplete={handleToggleComplete}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  ) : (
                    <NoTasksMessage
                      searchTerm={searchTerm}
                      onAddTaskClick={() => setShowAddForm(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }
      
      export default HomePage