<template>
  <div class="container">
    <h1 class="title">
      Table UI
    </h1>
    <hr color="#EDEDED" size="1" style="border:none">
    <div class="tContainer">
      <div class="tFilter">
        <div class="tFilter__groupBy">
          <b>Sorted by:</b>
          <button v-for="col in columnsToView" :key="col.key" class="tFilter__groupBy__param" :class="sortParams.sortColumn===col.key && 'tFilter__groupBy__param_active'" @click="sortProducts(col.key)">
            {{ col.name }} <img v-if="sortParams.sortColumn===col.key" class="tFilter__groupBy__param__img" :class="sortParams.sortTrend==='down' && 'transform180'" src="/arrowSort.png">
          </button>
        </div>
        <div class="tFilter__paginator">
          <button class="tFilter__paginator__button" :class="productsToDelete.length>0 && `tFilter__paginator__button_active`" @click="deleteProductFromDb()">
            Delete ({{ productsToDelete.length }})
          </button>
          <select v-model="productPerPage" class="tFilter__paginator__select">
            <option :value="10" class="tFilter__paginator__select__option">
              10 per page
            </option>
            <option :value="20" class="tFilter__paginator__select__option">
              20 per page
            </option>
            <option :value="25" class="tFilter__paginator__select__option">
              25 per page
            </option>
          </select>
          <button class="tFilter__paginator__changePageButton" @click="page--">
            <img src="/arrow.png">
          </button>
          <div><b>{{ (parseInt(page)-1)*parseInt(productPerPage)+1 }}-{{ parseInt(page)*parseInt(productPerPage) }} of {{ products.length }}</b></div>
          <button class="tFilter__paginator__changePageButton" @click="page++">
            <img class="transform180" src="/arrow.png">
          </button>
          <button class="tFilter__paginator__button multiplySelect__button" @click="customizeColumns=!customizeColumns">
            {{ columnsToView.length }} columns selected <img class="transform270" src="/arrow.png">
          </button>
          <div v-if="!!customizeColumns" class="multiplySelect__list">
            <div class="multiplySelect__list__option multiplySelect__list__option_selectAll" @click="changeAllColumns()">
              <input :checked="testAllChecked()" type="checkbox">
              <label>Select All</label>
            </div>
            <div v-for="col in defaultColumns" :key="col.key" class="multiplySelect__list__option" @click="changeColumns(col.id)">
              <input type="checkbox" :checked="testChecked(col.id)">
              <label>{{ col.name }}</label>
            </div>
          </div>
        </div>
      </div>
      <Table
        v-if="products.length>1"
        :products="products"
        :columns-to-view="columnsToView"
        :per-page="productPerPage"
        :page="page"
        :sort-params="sortParams"
        :add-product-to-delete="addProductToDelete"
        :products-to-delete="productsToDelete"
        :delete-one-product-from-db="deleteOneProductFromDb"
        :error="errorConnection"
        @update-product-to-delete="updateProductsToDelete"
      />
      <!-- p>{{ products }} {{ $store.state.products.state.tryStore }}  {{ errorConnection }}</! -->
    </div>
    <ErrorPopup v-if="errorConnection" />
  </div>
</template>

<script>
/* eslint-disable no-console */

import Table from '~~/components/Table'
import ErrorPopup from '~~/components/ErrorPopup'
export default {
  components: {
    Table, ErrorPopup
  },
  async asyncData ({ app, route, params, error, store }) {
    let errorConnectToProducts = false
    try {
      // console.log(store.dispatch)
      await store.dispatch('products/getProductList', null, { root: true })
      console.log(store.state.products.state.products)
    } catch (err) {
      errorConnectToProducts = true
    }
    return {
      products: store.state.products.state.products,
      errorConnection: errorConnectToProducts,
      columnsToView: [
        {
          id: 1,
          name: 'Product (100g serving)',
          key: 'product',
          sorted: false
        },
        {
          id: 2,
          name: 'Callories',
          key: 'calories',
          sorted: false
        },
        {
          id: 3,
          name: 'Fat (g)',
          key: 'fat',
          sorted: false
        },
        {
          id: 4,
          name: 'Carbs (g)',
          key: 'carbs',
          sorted: false
        },
        {
          id: 5,
          name: 'Protein (g)',
          key: 'protein',
          sorted: false
        },
        {
          id: 6,
          name: 'Iron (%)',
          key: 'iron',
          sorted: false
        }
      ],
      customizeColumns: false,
      defaultColumns: [
        {
          id: 1,
          name: 'Product (100g serving)',
          key: 'product',
          sorted: false
        },
        {
          id: 2,
          name: 'Callories',
          key: 'calories',
          sorted: false
        },
        {
          id: 3,
          name: 'Fat (g)',
          key: 'fat',
          sorted: false
        },
        {
          id: 4,
          name: 'Carbs (g)',
          key: 'carbs',
          sorted: false
        },
        {
          id: 5,
          name: 'Protein (g)',
          key: 'protein',
          sorted: false
        },
        {
          id: 6,
          name: 'Iron (%)',
          key: 'iron',
          sorted: false
        }
      ],
      checkColumnsToView: true,
      page: 1,
      productPerPage: 10,
      sortParams: {
        sortColumn: '',
        sortTrend: ''
      },
      productsToDelete: []
    }
  },
  watch: {
    page (newPage, oldPage) {
      // console.log(newPage, this.page, this.products.length, newPage <= 0 || newPage * this.page > this.products.length)
      if (newPage <= 0 || newPage * this.productPerPage > this.products.length) {
        this.page = oldPage
      }
    },
    productPerPage (newPerPage, oldPerPage) {
      console.log(newPerPage)
      if (newPerPage * this.page > this.products.length) {
        this.productPerPage = oldPerPage
      }
    }
  },
  methods: {
    updateProductsToDelete (val) {
      this.productsToDelete = val
    },
    changeColumns (col) {
      console.log(col, this.columnsToView)
      if (this.columnsToView.find(item => item.id === col)) {
        this.columnsToView = this.columnsToView.filter(item => item.id !== col)
      } else {
        this.columnsToView.push(this.defaultColumns.find(item => item.id === col))
      }
    },
    changeAllColumns () {
      console.log('changeAllColumns', this.checkColumnsToView)
      if (this.columnsToView.length === 6) {
        this.columnsToView = []
        this.checkColumnsToView = false
      } else {
        this.columnsToView = [...this.defaultColumns]
        this.checkColumnsToView = true
      }
    },
    testChecked (col) {
      console.log('testChecked', this.columnsToView.find(item => item.id === col))
      return this.columnsToView.find(item => item.id === col)
    },
    testAllChecked () {
      console.log('testAllChecked', this.defaultColumns.length === this.columnsToView.length)
      return this.defaultColumns.length === this.columnsToView.length
    },
    sortProducts (sortBy) {
      this.sortParams.sortColumn = sortBy
      if (this.sortParams.sortTrend === '' || this.sortParams.sortTrend === 'down') {
        this.$store.dispatch('products/sortProductsUp', sortBy, { root: true })
        this.sortParams.sortTrend = 'up'
      } else if (this.sortParams.sortTrend === 'up') {
        this.$store.dispatch('products/sortProductsDown', sortBy, { root: true })
        this.sortParams.sortTrend = 'down'
      }
      console.log([...this.columnsToView].find(item => item.key === sortBy))
      const indexSortedColumn = this.columnsToView.indexOf(this.columnsToView.find(function (item) {
        console.log(item.key, sortBy)
        return item.key === sortBy
      }))
      const temp = this.columnsToView[0]
      this.columnsToView[0] = this.columnsToView[indexSortedColumn]
      this.columnsToView[indexSortedColumn] = temp
    },
    addProductToDelete (product) {
      const index = this.productsToDelete.indexOf(product)
      if (index >= 0) {
        console.log(index)
        this.productsToDelete.splice(index, 1)
      } else {
        this.productsToDelete.push(product)
      }
    },
    async deleteProductFromDb () {
      try {
        await this.$store.dispatch('products/deleteProducts', this.productsToDelete, { root: true })
        this.errorConnection = false
        this.productsToDelete = []
      } catch {
        this.errorConnection = true
      }
      this.products = this.$store.state.products.state.products
    },
    async deleteOneProductFromDb (productId) {
      try {
        await this.$store.dispatch('products/deleteOneProduct', productId)
        this.errorConnection = false
      } catch {
        console.log('ошибка удаления одного')
        this.errorConnection = true
      }
      this.products = this.$store.state.products.state.products
    }
  }
}
</script>

<style lang="sass">
.container
  position: relative
  width: 1140px
  margin: auto
  color: #3D374A
  font-style: normal
  font-weight: normal
  font-family: 'Source Sans Pro'

.title
  height: 57px
  margin: 0
  display: flex
  align-items: center
  width: 100%
  font-style: normal
  font-weight: 600
  font-size: 32px
  line-height: 40px
  color: #282136

hr
  height: 1px
  color: #EDEDED

.tFilter
  display: flex
  position: relative
  flex-direction: row
  width: 100%
  height: 32px
  &__paginator
    align-self: flex-end
    margin-left: auto
    display: flex
    height: 100%
    align-items: center
    justify-content: flex-end
    b
      white-space: nowrap
    &__button
      border: 1px solid #C6CBD4
      border-radius: 2px
      font-size: 14px
      line-height: 24px
      height: 100%
      padding: 0 15px
      white-space: nowrap
      align-items: center
      display: flex
      color: #5B5E77
      &_active
        background-color: #00a11e
        border-color: #00a11e
        color: white
    &__changePageButton
      border: 1px solid #C6CBD4
      border-radius: 2px
      height: 100%
      display: flex
      align-items: center
      margin: 0 2%
    &__select
      border: 1px solid #D5DAE0
      box-sizing: border-box
      border-radius: 2px
      font-size: 14px
      line-height: 24px
      height: 100%
      background: #F2F2F2
      color: #5B5E77
      margin: 0 0 0 2%
      &__option
        background: #FFFFFF
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16)
        border-radius: 4px
  &__groupBy
    display: flex
    font-size: 14px
    line-height: 24px
    flex-direction: row
    align-items: center
    flex: 1
    b
      font-weight: 600
      margin-right: 5px
    &__param
      padding: 8px 5px
      display: flex
      justify-content: center
      align-items: center
      border: none
      background: none
      margin-left: 1px
      &__img
        object-fit: cover
        margin-left: 5px
      &_active
        background: #00A11E
        border-radius: 2px
        color: white
      &:focus
        outline: none
.multiplySelect__list
  position: absolute
  top: 50px
  background: #FFFFFF
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16)
  border-radius: 4px
  height: 243px
  width: 207px
  padding: 20px 20px 0 20px
  overflow: auto
  &__option
    font-family: Source Sans Pro
    font-style: normal
    font-weight: normal
    font-size: 14px
    line-height: 24px
    margin-bottom: 10px
    display: flex
    align-items: center
    input
      margin-right: 10px
    &_selectAll
      font-weight: 600
.transform180
  transform: rotate(180deg)
.transform270
  transform: rotate(270deg)
</style>
