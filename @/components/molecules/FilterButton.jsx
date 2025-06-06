import Button from '@/components/atoms/Button'
      
      const FilterButton = ({ label, count, onClick, isActive }) => (
        <Button
          onClick={onClick}
          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
            isActive
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
          }`}
        >
          <span>{label}</span>
          <span className="text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
            {count}
          </span>
        </Button>
      )
      
      export default FilterButton