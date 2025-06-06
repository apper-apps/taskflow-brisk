const Button = ({ children, className = '', ...props }) => {
        return (
          <button className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${className}`} {...props}>
            {children}
          </button>
        )
      }
      
      export default Button