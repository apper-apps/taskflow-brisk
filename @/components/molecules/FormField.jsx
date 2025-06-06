import Label from '@/components/atoms/Label'
      
      const FormField = ({ label, children, className = '' }) => (
        <div className={className}>
          {label && <Label>{label}</Label>}
          {children}
        </div>
      )
      
      export default FormField