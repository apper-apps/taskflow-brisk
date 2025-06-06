import Icon from '@/components/atoms/Icon'
      import Button from '@/components/atoms/Button'
      
      const TaskActions = ({ onEdit, onDelete }) => (
        <div className="flex items-center space-x-2 ml-4">
          <Button
            onClick={onEdit}
            className="p-1 text-surface-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
          >
            <Icon name="Edit2" className="h-4 w-4" />
          </Button>
          <Button
            onClick={onDelete}
            className="p-1 text-surface-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Icon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      )
      
      export default TaskActions