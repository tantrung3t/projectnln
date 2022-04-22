import React, { useEffect, useState } from "react"
import CartItem from '../components/CartItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import './CartScreen.css';

localStorage.setItem("total", 0)
localStorage.setItem("orders", "")

export default function CartScreens(props) {
  // console.log("re render")
  const url = "http://localhost:3003";

  const [listOrder, setListOrder] = useState([])

  const [modal, setModal] = useState("modal hide");

  const [productsCart, setProductsCart] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0)
  
  let profile = "";
  if (localStorage.getItem("profile") === "") {
    profile = ""
  }
  else {
    profile = JSON.parse(localStorage.getItem("profile"));
  }
  const [order] = useState({
    fname: profile.info_fname,
    lname: profile.info_lname,
    date: profile.info_date,
    sex: profile.info_sex,
    email: profile.info_email,
    phone: profile.info_phone_number,
    address: profile.info_address
  })

  useEffect(() => {
    loadData()
  }, [props.onChangeCart]);

  const momoPayment = async(event) => {
    event.preventDefault();
    const databody = {
      "amount": totalPayment,
      "account_id": profile.account_id,
      "order_address": document.getElementById("info-order__address").value,
      listOrder
    }
    await axios({
      method: 'post',
      url: 'http://localhost:3003/payment/momo_payment',
      data: databody
    })
      .then(function (response) {
        const data = response.data;
        console.log(data)
        window.location = data.payUrl
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  const cashPayment = async(event) => {
    event.preventDefault();
    const databody = {
      "amount": totalPayment,
      "account_id": profile.account_id,
      "order_address": document.getElementById("info-order__address").value,
      listOrder
    }

    await axios({
      method: 'post',
      url: 'http://localhost:3003/payment/cash_payment',
      data: databody
    })
      .then(function (response) {
        const data = response.data;
        console.log(data)
        window.location = "http://localhost:3000/thanhtoan?payment=cashPayment"
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleCheck = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempProduct = productsCart.map((product) => {
        return { ...product, isChecked: checked };
      });
      setProductsCart(tempProduct);
    } else {
      let tempProduct = productsCart.map((product) =>
        name == product.product_id ? { ...product, isChecked: checked } : product
      );
      setProductsCart(tempProduct);
    }
  };

  const close_modal = () => {
    setModal("modal hide");
  }
  const exit_modal = (e) => {
    if (e.target == e.currentTarget) close_modal();
  }

  // console.log(order)
  console.log(productsCart)
  const loadData = () => {
    axios.get(`http://localhost:3003/products/cart/` + localStorage.getItem('token'))
      .then(res => {
        const data = res.data;
        if(data === "") setProductsCart([])
        if (data.status !== 401 && data !== "") setProductsCart(data);
        
      })
      .catch(error => console.log(error));
  }

  const choosePayment = () => {
    if (listOrder.length === 0 || profile === "") {
      if (profile === "") alert("Vui lòng đăng nhập để tiến hàng đặt hàng!")
      else alert("Vui lòng chọn sản phẩm muốn mua để tiến hàng đặt hàng!")
    }
    else {
      setModal("modal")
      document.getElementById("info-order__total").value = totalPayment;
      console.log(totalPayment)
      console.log(listOrder)
    }
  }

  const callBackAddProductInOrder = (id, quantity) => {
    //add product in listOrder
    setListOrder([...listOrder, { id: id, quantity: quantity }])
  }
  const callBackRemoveProductInOrder = (id) => {
    //delete product in listOrder
    setListOrder(listOrder.filter(item => item.id !== id))
  }

  const callbackhadleTotal = (total) => {
    console.log("total cha: " + total)
    setTotalPayment(total)
  }
  return (
    <div className="grid">
      <div className="my-3">
        <div className="cart__title">
          <div className="px-4" >
            <input
              className="cbx"
              type={"checkbox"}
              name="allSelect"
              checked={!productsCart.some((product) => product?.isChecked !== true)}
              onChange={handleCheck}
            />
          </div>
          <span style={{ flex: "1", textAlign: "left" }}>Sản phẩm</span>
          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Thành tiền</span>
          <span>Thao tác</span>
        </div>
      </div>
      {
        productsCart.map((product, index) =>
          <CartItem
            key={index}
            id={product.product_id}
            isCheck={product?.isChecked || false}
            onChange={handleCheck}
            src={url + product.product_image}
            name={product.product_name}
            price={product.product_price}
            amount={product.product_amount}
            quantity={product.shopping_cart_amount}
            callbackhadleTotal={(total) => { callbackhadleTotal(total) }}
            callBackAddProductInOrder={(id, quantity) => { callBackAddProductInOrder(id, quantity) }}
            callBackRemoveProductInOrder={(id) => { callBackRemoveProductInOrder(id) }}
            isDelete={props.onChangeCart}
            setIsDelete={value => props.setOnChangeCart(value)}
          />
        )
      }
      {/* <div style={{position: "fixed", bottom: "0", width: "100"}}> */}

      <div className="cart__footer--wrap">
        <div className="grid cart__footer">
          <div className="px-4">
            <input
              id={"cbx"}
              className="cbx"
              type={"checkbox"}
              name="allSelect"
              checked={!productsCart.some((product) => product?.isChecked !== true)}
              onChange={handleCheck}
            />
            &nbsp;Chọn tất cả
          </div>
          <div>Xóa</div>
          <div>Tổng hóa đơn: {localStorage.getItem('total')} </div>
          <div
            className="btn btn-primary"
            style={{ fontSize: "16px" }}
            onClick={choosePayment}
          >Đặt Hàng</div>
        </div>
      </div>
      {/* <div className="modal fade" id="modalLoginForm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            aaa
          </div>
        </div>
      </div> */}
      <div className={modal} onClick={exit_modal}>
        <div className="modal__inner">
          <div className="modal__header flex beetween">
            <p>Thông tin đặt hàng</p>
            <FontAwesomeIcon icon={faXmarkCircle} fontSize={35} onClick={close_modal} />
          </div>
          <form className="modal_body">
            <div className="CartScreen_modal_body">
              <div className="form-input--wrap">
                <label htmlFor="info-order__name">Tên: </label>
                <input
                  id="info-order__name"
                  className="form-input"
                  type={"text"}
                  name="name"
                  placeholder="Tên"
                  disabled={true}
                  defaultValue={order.lname + " " + order.fname}
                />
              </div>
              <div className="form-input--wrap">
                <label htmlFor="info-order__phone">Số điện thoại: </label>
                <input
                  id="info-order__phone"
                  className="form-input"
                  type={"text"}
                  name="phone"
                  disabled={true}
                  placeholder="Số điện thoại"
                  defaultValue={order.phone}
                />
              </div>
              <div className="form-input--wrap">
                <label htmlFor="info-order__email">Email: </label>
                <input
                  id="info-order__email"
                  className="form-input"
                  type={"email"}
                  name="email"
                  placeholder="Email"
                  disabled={true}
                  defaultValue={order.email}
                />
              </div>
              <div className="form-input--wrap">
                <label htmlFor="info-order__address">Địa chỉ: </label>
                <input
                  id="info-order__address"
                  className="form-input"
                  type={"text"}
                  name="address"
                  placeholder="Địa chỉ"
                  defaultValue={order.address}
                />
              </div>
              <div className="form-input--wrap">
                <label htmlFor="info-order__total">Số tiền thanh toán</label>
                <input
                  id="info-order__total"
                  className="form-input"
                  type={'number'}
                  name="total"
                  disabled={true}
                />
              </div>
            </div>
            <div className="CartScreen_modal_footer" >
              <button


                onClick={momoPayment}
                className="CartScreen_modal_footer_button_momo">
                <img className="CartScreen_modal_image" src='../assets/img/MoMo_Logo.png'></img>
                Thanh toán qua ví MoMo
              </button>
              <button

                onClick={cashPayment}
                className="CartScreen_modal_footer_button_offline">
                <img className="CartScreen_modal_image" src='../assets/img/payment_logo.png'></img>
                Thanh toán khi nhận hàng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}