import "./ForgotPasswordScreen.css"
import axios from "axios";

export default function ForgotPasswordScreen() {

    const handleSubmit = (event) => {
        event.preventDefault();

        const dataSubmit = new FormData(event.currentTarget);

        var dataBody = {
            "username_forgot_password": dataSubmit.get('username_forgot_password'),
          };

        console.log(dataBody)
        
        axios.post('http://localhost:3003/account/forgotpassword',
          dataBody, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })

    }
    return (
        <div className="ForgotPassword-container">
            <div className="ForgotPassword-container-sign">
                <form className="form-sign" onSubmit={handleSubmit}>
                    <h1 className="ForgotPassword-h1-sign">Quên mật khẩu</h1>
                    <p>Chúng tôi sẽ gửi thông tin đến email mà bạn đã đăng ký để cấp lại mật khẩu</p>
                    <input name="username_forgot_password" className="input-sign" type="text" placeholder="Tên đăng nhập" />
                    <button type="submit" className="button-sign my-2">Gửi Email</button>
                </form>
            
            </div>
        </div>
    )
}