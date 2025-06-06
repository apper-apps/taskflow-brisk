import { format } from 'date-fns'
      import Icon from '@/components/atoms/Icon'
      import Paragraph from '@/components/atoms/Paragraph'
      
      const TaskInfo = ({ dueDate, categoryName, categoryColor, getDueDateColor, priority }) => (
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            {dueDate && (
              <div className={`flex items-center space-x-1 text-sm ${getDueDateColor(dueDate)}`}>
                <Icon name="Calendar" className="h-4 w-4" />
                <span>{format(new Date(dueDate), 'MMM d, yyyy')}</span>
              </div>
            )}
            {categoryName && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor }} />
                <Paragraph className="text-sm">
                  {categoryName}
                </Paragraph>
              </div>
            )}
          </div>
          <Paragraph className="text-xs capitalize text-surface-500 dark:text-surface-400">
            {priority} priority
          </Paragraph>
        </div>
      )
      
      export default TaskInfo