import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <ApperIcon name="AlertCircle" className="h-24 w-24 text-surface-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-surface-900 dark:text-white mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back to managing your tasks.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors shadow-soft"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Back to TaskFlow
        </Link>
      </div>
    </div>
  )
}

export default NotFound