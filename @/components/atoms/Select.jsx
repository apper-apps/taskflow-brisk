const Select = ({ children, className = '', ...props }) => {
        return (
          <select
            className={`w-full p-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-surface-900 dark:text-white ${className}`}
            {...props}
          >
            {children}
          </select>
        )
      }
      
      export default Select