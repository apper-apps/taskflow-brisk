import Icon from '@/components/atoms/Icon'
      import Input from '@/components/atoms/Input'
      
      const SearchBar = ({ searchTerm, setSearchTerm }) => (
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400"
            />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
          </div>
        </div>
      )
      
      export default SearchBar