import Card from '@/components/atoms/Card'
      import Heading from '@/components/atoms/Heading'
      import Paragraph from '@/components/atoms/Paragraph'
      
      const ProgressCard = ({ completedTasks, totalTasks, completionPercentage }) => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <Heading level={2} className="text-2xl mb-2">
                  Today's Progress
                </Heading>
                <Paragraph>
                  {completedTasks} of {totalTasks} tasks completed
                </Paragraph>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-200 dark:text-surface-700"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${completionPercentage}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-surface-900 dark:text-white">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
      
      export default ProgressCard