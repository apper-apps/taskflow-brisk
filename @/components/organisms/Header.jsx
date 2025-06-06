import Icon from '@/components/atoms/Icon'
      import Heading from '@/components/atoms/Heading'
      import Paragraph from '@/components/atoms/Paragraph'
      import Button from '@/components/atoms/Button'
      import SearchBar from '@/components/molecules/SearchBar'
      
      const Header = ({ completionPercentage, searchTerm, setSearchTerm, darkMode, setDarkMode }) => {
        return (
          <header className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
                    <Icon name="CheckSquare" className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Heading level={1} className="text-xl">
                      TaskFlow
                    </Heading>
                    <Paragraph className="text-sm">
                      {completionPercentage}% Complete
                    </Paragraph>
                  </div>
                </div>
      
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
                <Button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                  <Icon
                    name={darkMode ? "Sun" : "Moon"}
                    className="h-5 w-5 text-surface-600 dark:text-surface-400"
                  />
                </Button>
              </div>
            </div>
          </header>
        )
      }
      
      export default Header