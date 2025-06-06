import Paragraph from '@/components/atoms/Paragraph'
      
      const CategoryChip = ({ categoryName, color }) => {
        if (!categoryName) return null
      
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <Paragraph className="text-sm">
              {categoryName}
            </Paragraph>
          </div>
        )
      }
      
      export default CategoryChip