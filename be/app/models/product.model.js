
const db = require('../common/connect');

const product = function () {
}

product.get_product_id = function (id, result) {
    var strquery = "SELECT  products.product_id, products.product_name, products.product_price, products.product_image, products.product_amount, products.product_sold, products.product_description, products_brand.product_brand_name, products_type.product_type_name   FROM `products`, products_brand, products_type WHERE products.product_brand_id = products_brand.product_brand_id and products.product_type_id = products_type.product_type_id and products.product_id = " + id;
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

product.get_all_product = function (id, result) {
    var strquery = "SELECT  products.product_id, products.product_name, products.product_price, products.product_image, products.product_amount, products.product_sold , products_brand.product_brand_name, products_type.product_type_name   FROM `products`, products_brand, products_type WHERE products.product_brand_id = products_brand.product_brand_id and products.product_type_id = products_type.product_type_id";
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

product.get_thu_an_cun = function (result) {
    var strquery = "SELECT  products.product_id, products.product_name, products.product_price, products.product_image, products.product_amount, products.product_sold , products_brand.product_brand_name, products_type.product_type_name   FROM `products`, products_brand, products_type WHERE products.product_brand_id = products_brand.product_brand_id and products.product_type_id = products_type.product_type_id and products_type.product_type_id = 1";
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

product.get_thu_an_meo = function (result) {
    var strquery = "SELECT  products.product_id, products.product_name, products.product_price, products.product_image, products.product_amount, products.product_sold , products_brand.product_brand_name, products_type.product_type_name   FROM `products`, products_brand, products_type WHERE products.product_brand_id = products_brand.product_brand_id and products.product_type_id = products_type.product_type_id and products_type.product_type_id = 2";
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

product.get_do_choi_thu_cung = function (result) {
    var strquery = "SELECT  products.product_id, products.product_name, products.product_price, products.product_image, products.product_amount, products.product_sold , products_brand.product_brand_name, products_type.product_type_name   FROM `products`, products_brand, products_type WHERE products.product_brand_id = products_brand.product_brand_id and products.product_type_id = products_type.product_type_id and products_type.product_type_id = 3";
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

product.get_phu_kien_thu_cung = function (result) {
    var strquery = "SELECT  products.product_id, products.product_name, products.product_price, products.product_image, products.product_amount, products.product_sold , products_brand.product_brand_name, products_type.product_type_name   FROM `products`, products_brand, products_type WHERE products.product_brand_id = products_brand.product_brand_id and products.product_type_id = products_type.product_type_id and products_type.product_type_id = 4";
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

product.get_chuong_thu_cung = function (result) {
    var strquery = "SELECT  products.product_id, products.product_name, products.product_price, products.product_image, products.product_amount, products.product_sold , products_brand.product_brand_name, products_type.product_type_name   FROM `products`, products_brand, products_type WHERE products.product_brand_id = products_brand.product_brand_id and products.product_type_id = products_type.product_type_id and products_type.product_type_id = 5";
    db.query(strquery, function (err, data) {
        if (err) {
            result(null);
        }
        else {
            result(data);
        }
    })
}

//Add products
product.add_product = function (product_data, result) {

    var strquery = "INSERT INTO `products`(`product_brand_id`, `product_type_id`, `product_name`, `product_price`, `product_description`, `product_amount`, `product_sold`, `product_image`) VALUES ('"+ product_data.product_brand_id +"','"+product_data.product_type_id+"','"+ product_data.product_name +"','"+ product_data.product_price +"','"+ product_data.product_description +"','" + product_data.product_amount +"','" + product_data.product_sold +"','" + product_data.product_image+ "')"

    db.query(strquery, function (err) {
        if (err) {
            result({
                status: 400,
                message: "Fail to add product to database"
            });
        }
        else {
            result({
                status: 200,
                message: "Add product to database successfully"
            });
        }
    })

    // var data = {
    //     status: 200,
    //     message: "OK"
    // }
    // result(data)
}




module.exports = product;