const Input = ({ className = '', ...props }) => {
        return (
          <input
            className={`w-full p-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 ${className}`}
            {...props}
          />
        )
      }
      
      export default Input