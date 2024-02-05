
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.user && responseData.token) {
          const { user, token } = responseData;
          console.log(user);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);

          document.cookie = `token=${responseData.token}; path=/; expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString()}`;
          document.cookie = `user=${JSON.stringify(responseData.user)}; path=/; expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString()}`;

          console.log("Giriş başarılı.");

          if (user.userType === "admin") {
            navigate("/admin");
          } else if (user.userType === "user" || user.userType === "editor") {
            navigate("/");
          }
        } else {
          console.log("Giriş başarısız: Sunucudan beklenen veri alınamadı");
        }
      } else {
        const { message } = await response.json();
        console.log("Giriş başarısız:", message);
      }

    } catch (error) {
      console.log("Giriş hatası:", error);
    }
  };

  return (
      <div className="account-column">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
            <span>
              Username <span className="required">*</span>
            </span>
              <input type="text" name="userName" onChange={handleInputChange} />
            </label>
          </div>
          <div>
            <label>
            <span>
              Password <span className="required">*</span>
            </span>
              <input
                  type="password"
                  name="password"
                  onChange={handleInputChange}
              />
            </label>
          </div>
          <p className="remember">
            <label>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button className="btn btn-sm" type="submit">Login</button>
          </p>
          <a href="#" className="form-link">
            Lost your password?
          </a>
        </form>
      </div>
  );
};

export default Login;
