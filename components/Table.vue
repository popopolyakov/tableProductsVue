<template>
  <div class="tDataContainer">
    <!--p>{{ columnsToView }} {{ (parseInt(page)-1)*parseInt(perPage) }} {{ parseInt(page)*parseInt(perPage) }} </!--p -->
    <table class="tData">
      <thead>
        <tr class="tData__header">
          <th class="tData__header__checkbox">
            <label>
              <input type="checkbox" :checked="testAllChecked()" @click="deleteAll()">
            </label>
          </th>
          <th v-for="col in columnsToView" :key="col.key" class="tData__header__th" :class="sortParams.sortColumn === col.key && 'tData__header__th_active'" :style="`flex-basis: ${950/columnsToView.length}px`">
            {{ col.name }}
            <img v-if="sortParams.sortColumn===col.key" style="margin-left: 5px" :class="sortParams.sortTrend==='down' && 'transform180'" src="/arrowSort.png">
          </th>
        </tr>
      </thead>
      <tbody class="tData__products">
        <tr v-for="product in products.slice((parseInt(page)-1)*parseInt(perPage), parseInt(page)*parseInt(perPage))" :key="product.id" class="tData__product" @mouseenter="showDelete.push(product.id)" @mouseleave="showDelete.pop()">
          <td class="tData__product__checkbox">
            <input type="checkbox" :checked="checkToDelete(product.id)" @click="addProductToDelete(product.id)">
          </td>
          <td v-for="col in columnsToView" :key="col.key" :style="`flex-basis: ${950/columnsToView.length}px`">
            {{ product[col.key] }}
          </td>
          <td class="tData__product__deleteTd">
            <button v-if="showDelete.includes(product.id)" class="tData__product__deleteTd__button" @click="showDeletePopupFunc(product.id)">
              <img src="/trash.png"><span>Delete</span>
            </button>
            <div v-if="showDeletePopup.includes(product.id)" class="tData__product__deletePopup">
              <div>
                Are you sure want to <b>delete item</b>?
              </div>
              <div class="tData__product__deletePopup__buttonGroup">
                <button
                  class="tData__product__deletePopup__buttonGroup__button tData__product__deletePopup__buttonGroup__button_confirm"
                  @click="deleteOneProductFromDb(product.id)"
                >
                  Delete
                </button>
                <button
                  class="tData__product__deletePopup__buttonGroup__button tData__product__deletePopup__buttonGroup__button_cancel"
                  @click="hidePopup(product.id)"
                >
                  Cancel
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  props: {
    products: {
      type: Array,
      default: () => {}
    },
    columnsToView: {
      type: Array,
      default: () => {}
    },
    perPage: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 1
    },
    sortParams: {
      type: Object,
      default: () => {}
    },
    productsToDelete: {
      type: Array,
      default: () => {}
    },
    addProductToDelete: {
      type: Function,
      default: () => {}
    },
    deleteOneProductFromDb: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      checkedAllProductOnPage: false,
      showDelete: [],
      showDeletePopup: [],
      productPage: this.products.slice((parseInt(this.page) - 1) * parseInt(this.perPage), parseInt(this.page) * parseInt(this.perPage)),
      errorLocal: this.error
    }
  },
  methods: {
    showDeletePopupFunc (product) {
      console.log('Delete One Product Popup')
      this.showDelete.push(product)
      this.showDeletePopup.push(product)
    },
    checkToDelete (item) {
      return this.productsToDelete.includes(item) || this.checkedAllProductOnPage
    },
    deleteAll () {
      const productsOnPage = this.products.slice((parseInt(this.page) - 1) * parseInt(this.perPage), parseInt(this.page) * parseInt(this.perPage))
      const idsProductsToDelete = productsOnPage.map(item => item.id)
      console.log('deleteAll', this.productsToDelete.length === idsProductsToDelete.length, this.productsToDelete.length, idsProductsToDelete.length)
      if (this.testAllChecked()) {
        const productsToDelete = this.productsToDelete.filter(item => this.productPage.includes(item))
        this.$emit('update-product-to-delete', productsToDelete)
      } else {
        console.log(idsProductsToDelete)
        let productsToDelete = [...this.productsToDelete, ...idsProductsToDelete]
        productsToDelete = [...new Set(productsToDelete)]
        this.$emit('update-product-to-delete', productsToDelete)
        console.log(this.productsToDelete)
      }
    },
    testAllChecked () {
      const productsOnPage = this.products.slice((parseInt(this.page) - 1) * parseInt(this.perPage), parseInt(this.page) * parseInt(this.perPage))
      const idsProductsToDelete = productsOnPage.map(item => item.id)
      return this.productsToDelete.filter(item => idsProductsToDelete.includes(item)).length === idsProductsToDelete.length
    },
    hidePopup (product) {
      this.showDelete = [...new Set(this.showDelete)]
      this.showDeletePopup = [...new Set(this.showDeletePopup)]
      this.showDelete.splice(this.showDelete.indexOf(product), 1)
      this.showDeletePopup.splice(this.showDeletePopup.indexOf(product), 1)
    }
  }
}
</script>

<style lang="sass">
.tData
  width: 100%
  display: flex
  flex-direction: column
  background: #FFFFFF
  margin-top: 15px
  &__products
    width: 100%
    display: flex
    flex-direction: column
  &__header
    display: flex
    flex-direction: row
    flex-wrap: wrap
    height: 49px
    border-bottom: 1px solid #EDEDED
    align-items: center
    padding: 0 15px
    box-sizing: border-box
    th
      display: flex
      flex-basis: 150px
      align-items: center
      justify-content: center
      text-align: center
    &__th_active
      color: #00A11E
    &__checkbox
      flex-basis: 20px!important
  &__product
    display: flex
    flex-direction: row
    flex-wrap: wrap
    width: 100%
    text-align: center
    padding: 0 15px
    box-sizing: border-box
    height: 49px
    align-items: center
    &__deleteTd
      flex-basis: 70px
      &__button
        display: flex
        align-items: center
        color: #5B5E77
        background: none
        border: none
        outline: none
        &:active
          font-weight: 600
          outline: none
        &:focus
          font-weight: 600
          outline: none
        span
          margin-left: 5px
    &__deletePopup
      position: absolute
      background: white
      margin-top: 70px
      margin-left: -20px
      padding: 15px 20px
      z-index: 100
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16)
      border-radius: 4px
      white-space: nowrap
      &__buttonGroup
        &__button
          border: 1px solid #C6CBD4
          box-sizing: border-box
          border-radius: 4px
          padding: 5px 10px
          margin: 5px 10px 0 10px
          &_confirm
            background: #00A11E
            color: #FFF
            border: 1px solid #00A11E
          &_cancel
            background: #FFF
            color: #5B5E77
          &:active
            border: 1px solid #00A11E
    td
      display: flex
      align-items: center
      justify-content: center
    &__checkbox
      flex-basis: 20px!important
    &:nth-child(even)
      background: #F8F9FA
</style>
