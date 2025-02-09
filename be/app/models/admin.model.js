const db = require('../common/connect');

const admin = function () {
}

admin.list_orders = function (result) {
    var strquery = "SELECT orders.order_id, orders.order_payment_momo, infomation.info_fname, infomation.info_phone_number, orders.order_date, orders.order_address FROM `orders`, `infomation` WHERE orders.order_status = 0 and orders.account_id = infomation.account_id"
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}
admin.list_orders_nhanhang = function (result) {
    var strquery = "SELECT orders.order_id, orders.order_status, infomation.info_fname, infomation.info_phone_number, orders.order_date, orders.order_address FROM `orders`, `infomation` WHERE orders.order_status = 2 and orders.account_id = infomation.account_id"
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

admin.products_orders_by_id = function (id, result) {
    var strquery = "SELECT products.product_id, products.product_name, products.product_price, orders_detail.orders_detail_quantity FROM `orders_detail`, `products` WHERE products.product_id = orders_detail.product_id and orders_detail.order_id = " + id
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

admin.statistic_4month = function (result) {
    var dataResult = [];
    var strquery1 = "SELECT sum((orders_detail.orders_detail_quantity * products.product_price)) as total FROM `orders_detail`, orders, products WHERE orders.order_status = 1 and orders_detail.order_id = orders.order_id and orders_detail.product_id = products.product_id and MONTH(order_date) = 1;"
    var strquery2 = "SELECT sum((orders_detail.orders_detail_quantity * products.product_price)) as total FROM `orders_detail`, orders, products WHERE orders.order_status = 1 and orders_detail.order_id = orders.order_id and orders_detail.product_id = products.product_id and MONTH(order_date) = 2;"
    var strquery3 = "SELECT sum((orders_detail.orders_detail_quantity * products.product_price)) as total FROM `orders_detail`, orders, products WHERE orders.order_status = 1 and orders_detail.order_id = orders.order_id and orders_detail.product_id = products.product_id and MONTH(order_date) = 3;"
    var strquery4 = "SELECT sum((orders_detail.orders_detail_quantity * products.product_price)) as total FROM `orders_detail`, orders, products WHERE orders.order_status = 1 and orders_detail.order_id = orders.order_id and orders_detail.product_id = products.product_id and MONTH(order_date) = 4;"

    db.query(strquery1, function (err, data) {
        if (err || data[0].total == null) {
            dataResult.push({ "name": 'Tháng 1', "total": 0 })
        }
        else {
            dataResult.push({ "name": 'tháng 1', "total": data[0].total })
        }
    })
    db.query(strquery2, function (err, data) {
        if (err || data[0].total == null) {
            dataResult.push({ "name": 'tháng 2', "total": 0 })
        }
        else {
            dataResult.push({ "name": 'tháng 2', "total": data[0].total })
        }
    })
    db.query(strquery3, function (err, data) {
        if (err || data[0].total == null) {
            dataResult.push({ "name": 'tháng 3', "total": 0 })
        }
        else {
            dataResult.push({ "name": 'tháng 3', "total": data[0].total })
        }
    })
    db.query(strquery4, function (err, data) {
        if (err || data[0].total == null) {
            dataResult.push({ "name": 'tháng 4', "total": 0 })
        }
        else {
            dataResult.push({ "name": 'tháng 4', "total": data[0].total })
        }
        result(dataResult);
    })
}


admin.deny_or_accept_order = function (order_id, status_order,listProduct, result) {
    var strquery = "UPDATE `orders` SET `order_status`= '" + status_order + "' WHERE order_id = " + order_id
    db.query(strquery, function (err, data) {
        if (err) {
            result({
                status: 400,
                message: "Error"
            });
        }
        else {
            var strqueryIncrease = ""
            listProduct.map((item, i, row) => {
                strqueryIncrease = "UPDATE `products` SET `product_sold`= product_sold + "+ item.orders_detail_quantity +" WHERE product_id = " + item.product_id
                db.query(strqueryIncrease, function (err, data) {
                    if (err) {
                        result({
                            status: 400,
                            message: "Error"
                        });
                    }
                })
            
            })
            result({
                status: 200,
                message: "Successful"
            });
        }
    })
}

admin.yes_or_no = function (order_id, status_order, result) {
    var strquery = "UPDATE `orders` SET `order_status`= '" + status_order + "' WHERE order_id = " + order_id
    db.query(strquery, function (err, data) {
        if (err) {
            result({
                status: 400,
                message: "Error"
            });
        }
        else {
            result({
                status: 200,
                message: "Successful"
            });
        }
    })
}


admin.sales_last_month = function (result) {
    var strquery = "SELECT sum((products.product_price * orders_detail.orders_detail_quantity)) as total, products_type.product_type_id FROM `orders`, orders_detail, products, products_type WHERE orders.order_status = 1 and orders.order_id = orders_detail.order_id and products.product_id = orders_detail.product_id and products.product_type_id = products_type.product_type_id and MONTH(NOW()) - MONTH(order_date) = 1 group BY products_type.product_type_name"
    db.query(strquery, function (err, data) {
        if (err) {
            result(null)
        }
        else {
            result(data);
        }

    })
}
admin.sales_this_month = function (result) {
    var strquery = "SELECT sum((products.product_price * orders_detail.orders_detail_quantity)) as total, products_type.product_type_id FROM `orders`, orders_detail, products, products_type WHERE orders.order_status = 1 and orders.order_id = orders_detail.order_id and products.product_id = orders_detail.product_id and products.product_type_id = products_type.product_type_id and MONTH(NOW()) - MONTH(order_date) = 0 group BY products_type.product_type_name"
    db.query(strquery, function (err, data) {
        if (err) {
            result(null)
        }
        else {
            result(data);
        }

    })
}

admin.orders_and_quantity_sales = function (result) {
    var dataSend = { thisMonth: [], lastMonth: [] }
    var strquery1 = "SELECT orders_detail.order_id, orders_detail.orders_detail_quantity FROM `orders`, orders_detail WHERE orders.order_status = 1 and orders.order_id = orders_detail.order_id and MONTH(NOW()) - MONTH(order_date) = 0"
    var strquery2 = "SELECT orders_detail.order_id, orders_detail.orders_detail_quantity FROM `orders`, orders_detail WHERE orders.order_status = 1 and orders.order_id = orders_detail.order_id and MONTH(NOW()) - MONTH(order_date) = 1"

    db.query(strquery1, function (err, data) {
        if (err) {
            dataSend.thisMonth = 0
        }
        else {
            dataSend.thisMonth = data
        }

    })
    db.query(strquery2, function (err, data) {
        if (err) {
            dataSend.lastMonth = 0
        }
        else {
            dataSend.lastMonth = data
        }
        result(dataSend)
    })

}

admin.inventory_product = function (result) {
    var strquery = "SELECT * FROM products WHERE product_id NOT IN (SELECT products.product_id FROM `orders`, orders_detail, products WHERE MONTH(NOW()) - MONTH(order_date) != 2 and orders.order_id = orders_detail.order_id and orders_detail.product_id = products.product_id) and product_sold < (product_amount * 0.5) and isDelete = 0"
    db.query(strquery, function (err, data) {
        if (err) {
            result(null)
        }
        else {
            result(data)
        }
    })
}

admin.outStockProduct = function (result) {
    var strquery = "SELECT * FROM `products` WHERE product_amount - product_sold < 15"
    db.query(strquery, function (err, data) {
        if (err) {
            result(null)
        }
        else {
            result(data)
        }
    })
}

admin.addBrand = function (brand_name, result) {

    var strquery = "INSERT INTO `products_brand`(`product_brand_name`) VALUES ('"+ brand_name +"')"
    db.query(strquery, function (err, data) {
        if (err) {
            result({
                status: 400,
                message: "Error"
            });
        }
        else {
            result({
                status: 200,
                message: "Successful"
            });
        }
    })
}



module.exports = admin;