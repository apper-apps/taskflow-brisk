import { motion } from 'framer-motion'
      import Card from '@/components/atoms/Card'
      import Icon from '@/components/atoms/Icon'
      import Heading from '@/components/atoms/Heading'
      import Paragraph from '@/components/atoms/Paragraph'
      import Button from '@/components/atoms/Button'
      
      const NoTasksMessage = ({ searchTerm, onAddTaskClick }) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Card className="p-8">
            <Icon name="CheckSquare" className="h-16 w-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
            <Heading level={3} className="text-lg mb-2">
              {searchTerm ? 'No tasks found' : 'No tasks yet'}
            </Heading>
            <Paragraph className="mb-6">
              {searchTerm
                ? `No tasks match "${searchTerm}". Try adjusting your search.`
                : 'Create your first task to get started with TaskFlow.'
              }
            </Paragraph>
            {!searchTerm && (
              <Button
                onClick={onAddTaskClick}
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
              >
                <Icon name="Plus" className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            )}
          </Card>
        </motion.div>
      )
      
      export default NoTasksMessage