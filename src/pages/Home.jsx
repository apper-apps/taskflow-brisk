import { useState, useEffect } from 'react'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { taskService } from '../services'

const Home = ({ darkMode, setDarkMode }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredTasks = tasks?.filter(task => 
    task?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
    task?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '')
  ) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-blue-50 to-purple-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
                <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                  TaskFlow
                </h1>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {completionPercentage}% Complete
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" 
                />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400"
                />
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="h-5 w-5 text-surface-600 dark:text-surface-400" 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Progress Ring */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-soft border border-white/20 dark:border-surface-700/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white mb-2">
                Today's Progress
              </h2>
              <p className="text-surface-600 dark:text-surface-400">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-200 dark:text-surface-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-surface-900 dark:text-white">
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <MainFeature 
          tasks={filteredTasks} 
          setTasks={setTasks} 
          loading={loading} 
          error={error}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  )
}

export default Home