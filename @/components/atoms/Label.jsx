const Label = ({ children, className = '', ...props }) => {
        return (
          <label className={`block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 ${className}`} {...props}>
            {children}
          </label>
        )
      }
      
      export default Label