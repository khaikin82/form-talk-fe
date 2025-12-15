# 🔐 JWT Token - Cơ Chế & Cách Sử Dụng

## 📌 JWT Là Gì?

**JWT (JSON Web Token)** là một chuỗi ký tự đặc biệt mà backend tạo ra để xác thực người dùng.

```
JWT Token có dạng: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│─────────────────────────────────────┬─────────────────────────────────────┬──────────────────────────────────────│
                   Header                                    Payload                            Signature
```

### 3 Phần Của JWT:
1. **Header**: Chứa thông tin thuật toán mã hóa (HS256)
2. **Payload**: Chứa dữ liệu người dùng (username, userId, etc.)
3. **Signature**: Chữ ký để xác minh token không bị giả mạo

---

## 🔄 Flow Đăng Nhập & Lưu Token

### **Bước 1: Người Dùng Đăng Nhập**
```
Login.jsx → handleSubmit()
    ↓
nhập username + password
    ↓
gọi useAuth().login(username, password)
```

### **Bước 2: Gửi Request Tới Backend**
```javascript
// authService.js → login()
fetch("http://localhost:9002/auth/login", {
  method: "POST",
  body: { username, password }
})
```

### **Bước 3: Backend Trả Về Token**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "creator02",
    "firstName": "Khai"
  }
}
```

### **Bước 4: Frontend Lưu Token Vào localStorage**
```javascript
// authService.js → login()
if (data.token) {
  localStorage.setItem("authToken", data.token)  // ← Lưu token
}

if (data.user) {
  localStorage.setItem("user", JSON.stringify(data.user))  // ← Lưu user info
}
```

### **Bước 5: AuthContext Cập Nhật State**
```javascript
// AuthContext.jsx → login()
const response = await authService.login(username, password)

if (response.user && response.token) {
  setUser(response.user)   // ← State: user
  setToken(response.token) // ← State: token
}
```

---

## 📂 Nơi Lưu Token

### **localStorage** (Browser Storage)
```javascript
// 💾 Lưu trữ trong localStorage
localStorage.setItem("authToken", token)

// 📖 Lấy lại khi cần
const token = localStorage.getItem("authToken")

// 🗑️ Xóa khi logout
localStorage.removeItem("authToken")
```

### **Memory** (React State)
```javascript
// AuthContext.jsx
const [token, setToken] = useState(null)

// ✅ Lưu vào state khi login
setToken(response.token)

// ❌ Xóa khi logout
setToken(null)
```

### **Tại Sao 2 Nơi?**
- **localStorage**: Persistent - token còn khi người dùng reload page
- **React State**: Real-time - các component có thể truy cập token ngay lập tức

---

## 🔗 Cách Sử Dụng Token

### **1. Lấy Token Khi Cần**

```javascript
// Cách 1: Từ useAuth hook (trong Component)
const { token } = useAuth()

// Cách 2: Từ localStorage (trong Service)
const token = localStorage.getItem("authToken")

// Cách 3: Từ authService
import { authService } from "../services/authService"
const token = authService.getToken()
```

### **2. Gửi Token Trong API Request**

```javascript
// ❌ KHÔNG CÓ TOKEN (401 Unauthorized)
fetch("http://localhost:9002/forms/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ formURL })
})

// ✅ CÓ TOKEN (200 OK)
fetch("http://localhost:9002/forms/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`  // ← Token được gửi ở đây
  },
  body: JSON.stringify({ formURL })
})
```

---

## 🎯 Luồng Dữ Liệu Token Trong Project

```
┌─────────────────────────────────────────────────────────────┐
│                     Login.jsx (Page)                        │
│                                                              │
│  1️⃣  User nhập username + password                          │
│  2️⃣  Gọi: await login(username, password)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ useAuth hook
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  AuthContext.jsx (Provider)                 │
│                                                              │
│  3️⃣  Gọi: authService.login(username, password)            │
│  4️⃣  Nhận response: { token, user }                        │
│  5️⃣  setState: setToken(response.token)                    │
│  6️⃣  setState: setUser(response.user)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   authService.js (Service)                  │
│                                                              │
│  7️⃣  Gửi POST /auth/login                                  │
│  8️⃣  localStorage.setItem("authToken", token)              │
│  9️⃣  localStorage.setItem("user", JSON.stringify(user))    │
│  return { token, user }                                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Request
                         ▼
                   Backend API (/auth/login)
                         │
                         │ HTTP Response
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Các API Call Với Token                         │
│                                                              │
│  CreateForm.jsx:                                            │
│    const { token } = useAuth()                             │
│    formService.createForm(url, token)                       │
│                                                              │
│  formService.js:                                            │
│    fetch("/forms/create", {                                │
│      headers: {                                             │
│        Authorization: `Bearer ${token}` ← Token được dùng   │
│      }                                                      │
│    })                                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Token Lifetime & Refresh

### **Token Hết Hạn?**
```javascript
// Nếu backend return 401 Unauthorized
if (response.status === 401) {
  // Token đã hết hạn, cần logout
  logout()
  onNavigate("login")
}
```

### **Cách Refresh Token** (nếu backend support)
```javascript
const refreshToken = async () => {
  const response = await fetch("/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  
  const { token: newToken } = await response.json()
  setToken(newToken)
  localStorage.setItem("authToken", newToken)
}
```

---

## 📋 Checklist Implementation

- ✅ Backend gửi token khi login thành công
- ✅ Frontend lưu token vào localStorage
- ✅ Frontend lưu token vào React state (AuthContext)
- ✅ Khi gọi API protected, gửi token trong header: `Authorization: Bearer ${token}`
- ✅ Xử lý lỗi 401 - clear token và redirect về login
- ✅ Khi logout - xóa token từ localStorage và state

---

## 🛠️ Code Examples

### **Lấy Token Và Gửi Trong API**

```javascript
// useFormData.js
const { token } = useAuth()

const createForm = useCallback(async (formUrl) => {
  // Gọi service với token
  const data = await formService.createForm(formUrl, token)
  return data
}, [token])
```

```javascript
// formService.js
export const formService = {
  createForm: async (formURL, token) => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CREATE_FORM}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // ← Token ở đây
        },
        body: JSON.stringify({ formURL }),
      }
    )
    // ...
  }
}
```

### **Logout - Xóa Token**

```javascript
// AuthContext.jsx
const logout = useCallback(() => {
  authService.logout()      // Xóa từ localStorage
  setUser(null)             // Xóa từ state
  setToken(null)            // Xóa từ state
  setError(null)
}, [])
```

```javascript
// authService.js
logout: () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
}
```

---

## 🚨 Common Errors

| Error | Nguyên Nhân | Cách Fix |
|-------|-----------|---------|
| 401 Unauthorized | Không gửi token hoặc token sai | Thêm `Authorization: Bearer ${token}` vào header |
| Token not found | Token không được lưu | Kiểm tra `localStorage.getItem("authToken")` |
| Context is undefined | Chưa wrap AuthProvider | Wrap App component với `<AuthProvider>` |
| Logout nhưng vẫn thấy user | State không được clear | Gọi `authService.logout()` để xóa localStorage |

---

## 📚 Summary

1. **Backend tạo JWT token** khi login thành công
2. **Frontend lưu token** vào localStorage + React state
3. **Khi gọi API protected**, gửi token trong header: `Authorization: Bearer ${token}`
4. **Token dùng để xác thực** - backend kiểm tra token hợp lệ
5. **Logout = xóa token** từ localStorage + state

✨ Vậy là xong!

