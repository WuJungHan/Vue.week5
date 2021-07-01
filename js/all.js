import productModal from './productModal.js';

//config
const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'eva29485577';

const app = Vue.createApp({
  data() {
    return {
      // 避免api一值被狂搓 使用讀取效果
      loadingStatus: {
        loadingItem: '',
      },
      // 產品列表
      products: [],
      // props 傳遞到內層的暫存資料
      product: {},
      // 表單結構-對應api-客戶購物 [免驗證]-結帳頁面
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
          message: '',
        },
        message: '',
      },
      // 購物車列表
      cart: {},
    };
  },
  methods: {
    //取得後端產品資料函式
    getProducts() {
      //客戶購物 [免驗證]-取得商品列表
      const api = `${apiUrl}/api/${apiPath}/products`;

      //抓取後端產品資料-get
      axios.get(api)
        .then(res => {
          //驗證抓取狀態
          //console.log(res);
          //將回傳的Products賦予給data的products陣列
          this.products = res.data.products;
          //驗證是否成功賦予
          //console.log(this.products);
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    //開啟單一產品modal-帶item參數 對應html按鈕@click="openModal(item)"的呼叫
    openModal(item) {
      //驗證是否帶item參數成功
      //console.log(item);

      //將參數的item.id賦予給loadingStatus的loadingItem值,去判斷當開啟modal時,是否啟動input的disabled效果,避免被用戶錯誤操作
      this.loadingStatus.loadingItem = item.id;

      //客戶購物 [免驗證]-單一商品細節
      const api = `${apiUrl}/api/${apiPath}/product/${item.id}`;
      //抓取後端單一產品資料-get
      axios.get(api)
        .then(res => {
          //驗證抓取狀態
          //console.log(res);
          //將回傳的Products賦予給data的products陣列
          this.product = res.data.product;

          //驗證
          //console.log(this.product);

          //將loadingStatus.loadingItem回覆原始狀態,解除disabled效果
          this.loadingStatus.loadingItem = ''

          //開啟Modal-調用ref html標籤名userProductModal所屬productModal.js裡的openModal()函式
          this.$refs.userProductModal.openModal();
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    //加入購物車 product_id(String)、qty(Number) 為必填欄位,qty = 1就是如果帶回的參數是無值,那自動將qty預設為1
    addCart(id, qty = 1) {
      //將參數的id賦予給loadingStatus的loadingItem值,去判斷當開啟modal時,是否啟動input的disabled效果,避免被用戶錯誤操作
      this.loadingStatus.loadingItem = id;

      //客戶購物 [免驗證]-加入購物車
      const api = `${apiUrl}/api/${apiPath}/cart`;
      //建立購物車結構 傳送回後台更新購物車用
      //格式 [參數]: { "data": { "product_id":"id","qty":數量 } }
      const cart = {
        product_id: id,
        qty: qty,
      }
      //更新後端購物車資料-post 將cart作為參數post回後端
      axios.post(api, { data: cart })
        .then(res => {
          //驗證加入購物車狀態
          //console.log(res);

          //將loadingStatus.loadingItem回覆原始狀態,解除disabled效果
          this.loadingStatus.loadingItem = '';

          //判斷是否成功加入購物車
          //如果res.data.success為true
          if (res.data.success) {
            //如果成功 跳出提示
            alert(res.data.message);

            //呼叫getCartList()渲染畫面
            this.getCartList();

            //關閉Modal-調用ref html標籤名userProductModal所屬productModal.js裡的hideModal()函式
            this.$refs.userProductModal.hideModal();
          } else {
            //如果未成功加入 跳出提示
            alert(res.data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    //取得購物車列表-渲染畫面
    getCartList() {
      //客戶購物 [免驗證]-取得商品列表
      const api = `${apiUrl}/api/${apiPath}/cart`;

      //抓取後端購物車資料-get
      axios.get(api)
        .then(res => {
          //驗證抓取狀態
          //console.log(res);
          //將回傳的carts陣列(res.data.data),賦予給data的cart物件
          this.cart = res.data.data;
          //驗證
          //console.log(this.cart);
        })
        .catch(function (error) {
          console.log(error);
        })

    },

    //更新購物車品項-帶item參數
    updateCart(item) {
      //將參數的item.id賦予給loadingStatus的loadingItem值,去判斷當開啟modal時,是否啟動input的disabled效果,避免被用戶錯誤操作
      this.loadingStatus.loadingItem = item.id;

      //客戶購物 [免驗證]-更新購物車 須注意此api id是購物車id 非產品id
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;

      //建立購物車結構 傳送回後台更新購物車用
      //格式 [參數]: { "data": { "product_id":"id","qty":數量 } }
      //帶上參數item的product產品id與qty 這邊qty由於input的v-model有加上後綴修飾符.number所以可以確保為數字型別
      const cart = {
        product_id: item.product.id,
        qty: item.qty,
      }

      //驗證
      //console.log(cart, api);

      //更新後端購物車資料-put 帶上更新所需結構cart物件
      axios.put(api, { data: cart })
        .then(res => {
          //驗證回傳狀態
          console.log(res);

          //將loadingStatus.loadingItem回覆原始狀態,解除disabled效果
          this.loadingStatus.loadingItem = '';

          //重新渲染購物車列表
          this.getCartList();
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    //刪除單筆購物車資料-帶item參數
    deleteCart(item) {
      //將參數的item.id賦予給loadingStatus的loadingItem值,去判斷當開啟modal時,是否啟動input的disabled效果,避免被用戶錯誤操作
      this.loadingStatus.loadingItem = item.id;

      //客戶購物 [免驗證]-刪除某一筆購物車資料 須注意此api id是購物車id 非產品id
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;

      //刪除單筆購物車請求-delete
      axios.delete(api)
        .then(res => {
          //驗證回傳狀態
          console.log(res);

          //將loadingStatus.loadingItem回覆原始狀態,解除disabled效果
          this.loadingStatus.loadingItem = '';

          //判斷是否成功刪除購物車
          if (res.data.success) {
            //如果成功 跳出提示
            alert(res.data.message);

            //重新渲染購物車列表
            this.getCartList();
          } else {
            //如果未成功加入 跳出提示
            alert(res.data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },

    //刪除購物車列表
    deleteCartList() {
      //客戶購物 [免驗證]-刪除某一筆購物車資料 須注意此api id是購物車id 非產品id
      const api = `${apiUrl}/api/${apiPath}/carts`;
      //客戶購物 [免驗證]-刪除全部購物車
      axios.delete(api)
        .then(res => {
          //驗證
          //console.log(res);

          //判斷是否成功刪除購物車清單
          //如果res.data.success為true
          if (res.data.success) {
            //如果成功 跳出提示
            alert(res.data.message);

            //重新渲染畫面
            this.getCartList();
          } else {
            //如果未成功加入 跳出提示
            alert(res.data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
        })

    },

    //送出訂單
    onSubmit() {
      //測試
      alert(`已建立訂單`);
      //待增加頁面轉換
    },
  },
  //進入畫面就執行
  mounted() {
    //呼叫產品列表
    this.getProducts();

    //呼叫getCartList()渲染畫面
    this.getCartList();
  },
});

//全域元件-匯入productModal.js元件 'userProductModal'對應html user-product-modal標籤 由於標籤不可有大血 所以轉寫
app.component('userProductModal', productModal)

//VeeValidate-加入多國語系
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
//Activate the locale-激活語言環境
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  //調整為輸入字元立即進行驗證
  validateOnInput: true,
});
//VeeValidate-定義規則-全部加入(CDN 版本)
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
//VeeValidate-註冊表單驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');