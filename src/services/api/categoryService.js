import categoryData from '../mockData/category.json'

let categories = [...categoryData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const categoryService = {
  async getAll() {
    await delay(200)
    return categories.map(category => ({ ...category }))
  },

  async getById(id) {
    await delay(150)
    const category = categories.find(c => c.id === id)
    return category ? { ...category } : null
  },

  async create(categoryData) {
    await delay(300)
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
      taskCount: 0
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, categoryData) {
    await delay(250)
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    
    categories[index] = { ...categories[index], ...categoryData }
    return { ...categories[index] }
  },

  async delete(id) {
    await delay(200)
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    
    categories.splice(index, 1)
    return true
  }
}