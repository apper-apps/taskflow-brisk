import { useEffect, useState } from 'react'
      import Heading from '@/components/atoms/Heading'
      import Card from '@/components/atoms/Card'
      import FilterButton from '@/components/molecules/FilterButton'
      import CategoryChip from '@/components/molecules/CategoryChip'
      import { categoryService } from '@/services'
      
      const TaskSidebar = ({ tasks, selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus }) => {
        const [categories, setCategories] = useState([])
      
        useEffect(() => {
          const loadCategories = async () => {
            try {
              const result = await categoryService.getAll()
              setCategories(result || [])
            } catch (err) {
              console.error('Failed to load categories:', err)
            }
          }
          loadCategories()
        }, [])
      
        const getCategoryColor = (categoryName) => {
          const category = categories.find(c => c.name === categoryName)
          return category?.color || '#6B7280'
        }
      
        return (
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <Heading level={3} className="text-lg mb-4">Filters</Heading>
      
              <div className="mb-6">
                <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Status</h4>
                <div className="space-y-2">
                  {[
                    { key: 'all', label: 'All Tasks', count: tasks?.length || 0 },
                    { key: 'active', label: 'Active', count: tasks?.filter(t => !t?.completed)?.length || 0 },
                    { key: 'completed', label: 'Completed', count: tasks?.filter(t => t?.completed)?.length || 0 }
                  ].map(status => (
                    <FilterButton
                      key={status.key}
                      label={status.label}
                      count={status.count}
                      onClick={() => setSelectedStatus(status.key)}
                      isActive={selectedStatus === status.key}
                    />
                  ))}
                </div>
              </div>
      
              <div>
                <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Categories</h4>
                <div className="space-y-2">
                  <FilterButton
                    label="All Categories"
                    count={tasks?.length || 0}
                    onClick={() => setSelectedCategory('all')}
                    isActive={selectedCategory === 'all'}
                  />
                  {categories?.map(category => {
                    const categoryTasks = tasks?.filter(t => t?.category === category?.name)?.length || 0
                    return (
                      <FilterButton
                        key={category?.id}
                        onClick={() => setSelectedCategory(category?.name)}
                        isActive={selectedCategory === category?.name}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category?.color }}
                          />
                          <span>{category?.name}</span>
                        </div>
                        <span className="text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded-full">
                          {categoryTasks}
                        </span>
                      </FilterButton>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>
        )
      }
      
      export default TaskSidebar