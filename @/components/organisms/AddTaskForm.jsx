import { motion, AnimatePresence } from 'framer-motion'
      import Input from '@/components/atoms/Input'
      import Textarea from '@/components/atoms/Textarea'
      import Select from '@/components/atoms/Select'
      import Button from '@/components/atoms/Button'
      import FormField from '@/components/molecules/FormField'
      
      const AddTaskForm = ({
        showAddForm,
        setShowAddForm,
        formData,
        setFormData,
        categories,
        handleSubmit,
        editingTask
      }) => {
        const handleCancel = () => {
          setShowAddForm(false)
          setEditingTask(null)
          setFormData({ title: '', description: '', dueDate: '', priority: 'medium', category: '' })
        }
      
        return (
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-soft border border-white/20 dark:border-surface-700/20"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField>
                    <Input
                      type="text"
                      placeholder="Task title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      autoFocus
                    />
                  </FormField>
      
                  <FormField>
                    <Textarea
                      placeholder="Description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </FormField>
      
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Due Date">
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
                    </FormField>
      
                    <FormField label="Priority">
                      <Select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </Select>
                    </FormField>
      
                    <FormField label="Category">
                      <Select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select category</option>
                        {categories?.map(category => (
                          <option key={category?.id} value={category?.name}>
                            {category?.name}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  </div>
      
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                    >
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        )
      }
      
      export default AddTaskForm