//匯出export default
//按下button"加入購物車時",會把input的v-model.number="qty"給帶進新增購物車add-cart函式(記得遇到大寫轉寫-),並利用內傳外$emit方法,將參數(產品id,數量)帶到all.js的addCart
export default {
  template: `<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ tempProduct.title }}</span>
          </h5>
          <button type="button" class="btn-close"
                  data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{ tempProduct.category }}</span>
              <p>商品描述：{{ tempProduct.description }}</p>
              <p>商品內容：{{ tempProduct.content }}</p>
              <div class="h5" v-if="!tempProduct.price">{{ tempProduct.origin_price }} 元</div>
              <del class="h6" v-if="tempProduct.price">原價 {{ tempProduct.origin_price }} 元</del>
              <div class="h5" v-if="tempProduct.price">現在只要 {{ tempProduct.price }} 元</div>
              <div>
                <div class="input-group">
                  <input type="number" class="form-control"
                        v-model.number="qty" min="1">
                  <button type="button" class="btn btn-primary"
                  @click="$emit('add-cart', tempProduct.id, qty)"
                          >加入購物車</button>
                </div>
              </div>
            </div>
            <!-- col-sm-6 end -->
          </div>
        </div>
      </div>
    </div>
  </div>`,
  //props 外傳內資料 html標籤user-product-modal使用 接收all.js data內的product資料
  props: ['product'],
  data() {
    return {
      status: {},
      tempProduct: {},
      modal: '',
      qty: 1,

    };
  },
  watch: {
    //監聽props的product 當資料變動時
    product() {
      //將product賦予給data的tempProduct(避免單向數據流 原始資料被修改 已重新指定新的記憶體位置,故不須淺層拷貝)
      this.tempProduct = this.product;
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
}