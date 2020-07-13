/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
import { getProducts, deleteProducts } from './request'

export const state = () => ({
  state: {
    products: [],
    tryStore: 'Hey im store'
  }
})

export const mutations = {
  GET_PRODUCTS_LIST ({ state }, resProduct) {
    console.log(state)
    state.products = resProduct
  },
  DELETE_PRODUCTS_LIST ({ state }, productsToDelete) {
    console.log(state.products.length, productsToDelete)
    state.products = state.products.filter(item => !productsToDelete.includes(item.id))
    console.log(state.products.length)
  },
  DELETE_ONE_PRODUCT ({ state }, productToDelete) {
    console.log(state.products.length, productToDelete)
    state.products = state.products.filter(item => item.id !== productToDelete)
    console.log(state.products.length)
  },
  SORT_PRODUCTS_UP ({ state }, sortBy) {
    state.products = state.products.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1)
  },
  SORT_PRODUCTS_DOWN ({ state }, sortBy) {
    state.products = state.products.sort((a, b) => a[sortBy] < b[sortBy] ? 1 : -1)
  }
}

export const actions = {
  async getProductList ({ state, commit }) {
    try {
      console.log('пашел процесс')
      const resProduct = await getProducts()
      // console.log(resProduct)
      await commit('GET_PRODUCTS_LIST', resProduct)
      console.log(state)
    } catch (err) {
      console.log(err)
      throw new Error('Внутреняя ошибка сервера, сообщите администратору')
    }
  },
  async deleteProducts ({ state, commit }, productToDelete) {
    try {
      await deleteProducts()
      await commit('DELETE_PRODUCTS_LIST', productToDelete)
    } catch (err) {
      console.log(err)
      throw new Error('Внутреняя ошибка сервера, сообщите администратору')
    }
  },
  async deleteOneProduct ({ state, commit }, idProduct) {
    try {
      console.log('пашел процесс', idProduct)
      await deleteProducts()
      await commit('DELETE_ONE_PRODUCT', idProduct)
      console.log('процесс окончен удаления одного окончен')
    } catch (err) {
      console.log(err)
      throw new Error('Внутреняя ошибка сервера, сообщите администратору')
    }
  },
  sortProductsUp ({ commit }, sortBy) {
    commit('SORT_PRODUCTS_UP', sortBy)
  },
  sortProductsDown ({ commit }, sortBy) {
    commit('SORT_PRODUCTS_DOWN', sortBy)
  }
}
console.log(actions)
export const getters = {
  // возвращаем список всех книг
  getProductsFromState: state => state.products
}
