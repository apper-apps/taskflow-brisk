const Card = ({ children, className = '', ...props }) => {
        return (
          <div
            className={`bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-soft border border-white/20 dark:border-surface-700/20 ${className}`}
            {...props}
          >
            {children}
          </div>
        )
      }
      
      export default Card