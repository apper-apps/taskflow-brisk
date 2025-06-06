import { motion, AnimatePresence } from 'framer-motion'
      import { isToday, isPast } from 'date-fns'
      import Icon from '@/components/atoms/Icon'
      import Heading from '@/components/atoms/Heading'
      import Paragraph from '@/components/atoms/Paragraph'
      import Button from '@/components/atoms/Button'
      import Card from '@/components/atoms/Card'
      import TaskActions from '@/components/molecules/TaskActions'
      import TaskInfo from '@/components/molecules/TaskInfo'
      
      const TaskList = ({
        tasks,
        categories,
        handleToggleComplete,
        handleEdit,
        handleDelete
      }) => {
        const getPriorityColor = (priority) => {
          switch (priority) {
            case 'high': return 'bg-red-500'
            case 'medium': return 'bg-orange-500'
            case 'low': return 'bg-green-500'
            default: return 'bg-surface-400'
          }
        }
      
        const getDueDateColor = (dueDate) => {
          if (!dueDate) return 'text-surface-500'
          const date = new Date(dueDate)
          if (isPast(date) && !isToday(date)) return 'text-red-500'
          if (isToday(date)) return 'text-orange-500'
          return 'text-surface-600 dark:text-surface-400'
        }
      
        const getCategoryColor = (categoryName) => {
          const category = categories.find(c => c.name === categoryName)
          return category?.color || '#6B7280'
        }
      
        return (
          <div className="space-y-4">
            <AnimatePresence>
              {tasks?.length > 0 ? (
                tasks.map(task => (
                  <motion.div
                    key={task?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card className="hover:shadow-card transition-all duration-200 group">
                      <div className="flex items-start space-x-4">
                        <Button
                          onClick={() => handleToggleComplete(task?.id)}
                          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            task?.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-surface-300 dark:border-surface-600 hover:border-green-500'
                          }`}
                        >
                          {task?.completed && (
                            <Icon name="Check" className="h-3 w-3 text-white" />
                          )}
                        </Button>
      
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Heading level={3} className={`text-lg transition-all ${
                                task?.completed
                                  ? 'text-surface-500 dark:text-surface-400 line-through'
                                  : 'text-surface-900 dark:text-white'
                              }`}>
                                {task?.title}
                              </Heading>
                              {task?.description && (
                                <Paragraph className={`mt-1 text-sm transition-all ${
                                  task?.completed
                                    ? 'text-surface-400 dark:text-surface-500'
                                    : 'text-surface-600 dark:text-surface-400'
                                }`}>
                                  {task?.description}
                                </Paragraph>
                              )}
                            </div>
      
                            <TaskActions
                              onEdit={() => handleEdit(task)}
                              onDelete={() => handleDelete(task?.id)}
                            />
                          </div>
      
                          <TaskInfo
                            dueDate={task?.dueDate}
                            categoryName={task?.category}
                            categoryColor={getCategoryColor(task?.category)}
                            getDueDateColor={getDueDateColor}
                            priority={task?.priority}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : null}
            </AnimatePresence>
          </div>
        )
      }
      
      export default TaskList