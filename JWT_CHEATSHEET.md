# 🔐 JWT Token - Cheat Sheet (Ngắn Gọn)

## ⚡ **Nhanh Chóng: JWT Là Gì?**

**JWT = String chứa thông tin người dùng + chữ ký mã hóa**

Ví dụ: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI6IjEyMzQ1NjcifQ.TJVA95U...`

---

## 🔄 **4 Bước: Từ Login Đến Sử Dụng Token**

### **1️⃣ Login - Lấy Token**
```javascript
// Login.jsx
const { login } = useAuth()
await login("creator02", "password123")
// ✅ Backend trả về: { token: "eyJ...", user: {...} }
```

### **2️⃣ Lưu Token**
```javascript
// authService.js (tự động lưu)
localStorage.setItem("authToken", token)      // Lưu vĩnh viễn
localStorage.setItem("user", JSON.stringify(user))
```

### **3️⃣ Lấy Token Khi Cần**
```javascript
// Trong component
const { token } = useAuth()
console.log(token)  // "eyJ..."

// Hoặc
const token = localStorage.getItem("authToken")
const token = authService.getToken()
```

### **4️⃣ Gửi Token Trong API**
```javascript
// formService.js
fetch("http://localhost:9002/forms/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`  // ← Token ở đây
  },
  body: JSON.stringify({ formURL: "..." })
})
```

---

## 📍 **3 Nơi Lưu & Lấy Token**

| Nơi | Code | Khi Nào Dùng |
|-----|------|------------|
| **localStorage** | `localStorage.getItem("authToken")` | Service, utility |
| **React State** | `const { token } = useAuth()` | Component |
| **authService** | `authService.getToken()` | Service |

---

## ✅ **Checklist: Token Được Gửi?**

Khi gặp lỗi **401 Unauthorized**, kiểm tra:

```javascript
❓ Token có được lấy không?
   const { token } = useAuth()
   console.log(token)  // Nếu undefined → ❌ Lỗi

❓ Token có được gửi trong header không?
   headers: {
     Authorization: `Bearer ${token}`  // ← Phải có cái này
   }

❓ Token format đúng không?
   "Authorization: Bearer eyJ..."  // ✅ Đúng
   "Authorization: ${token}"        // ❌ Sai (thiếu "Bearer ")

❓ Token hết hạn chưa?
   Server sẽ return 401 nếu token cũ
   → Cần logout & login lại
```

---

## 🗑️ **Logout - Xóa Token**

```javascript
// Dashboard.jsx
const { logout } = useAuth()

const handleLogout = () => {
  logout()  // Xóa localStorage + state
  onNavigate("login")
}
```

```javascript
// authService.js (tự động)
logout: () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
}
```

---

## 💾 **localStorage vs React State**

```javascript
// ✅ localStorage - Persistent (lưu sau reload)
localStorage.setItem("authToken", token)
const token = localStorage.getItem("authToken")

// ✅ React State - Real-time (mất sau reload)
const { token } = useAuth()

// 🎯 Tối ưu: Dùng cả 2
// - localStorage để dữ liệu sống lâu
// - React State để component truy cập nhanh
```

---

## 🔐 **Token Mỗi API Call**

```javascript
// ❌ KHÔNG có token → 401 Unauthorized
fetch("/forms/create", {
  headers: { "Content-Type": "application/json" }
})

// ✅ CÓ token → 200 OK
fetch("/forms/create", {
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
})
```

---

## 🚨 **Errors & Solutions**

| Error | Nguyên Nhân | Fix |
|-------|-----------|-----|
| **401 Unauthorized** | Không gửi token | Thêm `Authorization: Bearer ${token}` |
| **Token is undefined** | Chưa login hoặc logout | `const { token } = useAuth()` → check console |
| **Context error** | Chưa wrap AuthProvider | Wrap `<AuthProvider>` ở App.jsx |
| **Token stale** | Token hết hạn | Logout + login lại |

---

## 📞 **Quick Reference**

```javascript
// ✅ Lấy token
const { token } = useAuth()

// ✅ Login
const { login } = useAuth()
await login(username, password)

// ✅ Logout  
const { logout } = useAuth()
logout()

// ✅ Check authenticated
const { isAuthenticated } = useAuth()

// ✅ Get user info
const { user } = useAuth()

// ✅ Gửi API với token
headers: {
  "Authorization": `Bearer ${token}`
}
```

---

## 🎯 **Sequence Diagram**

```
User → Login → Backend (create JWT) → Save to localStorage
                                          ↓
Next Request → Lấy token từ localStorage → Gửi dalam header
                                          ↓
                        Backend verify token → Process request
                                          ↓
                                    Return data (200 OK)
```

---

## 📚 **Tài Liệu Chi Tiết**

📖 **JWT_TOKEN_GUIDE.md** - Giải thích đầy đủ  
📊 **JWT_VISUAL_DIAGRAM.md** - Diagram hình ảnh  
⚡ **JWT_CHEATSHEET.md** - File này (tóm tắt)

---

✨ **Tóm Tắt: Login → Lưu Token → Gửi Token Trong Mỗi API → Logout Xóa Token**
