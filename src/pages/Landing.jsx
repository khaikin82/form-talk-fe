import React from "react"
import { useNavigate } from "react-router-dom"
import { MessageSquare, Zap, BarChart3, Share2, ArrowRight, CheckCircle, Users, Lightbulb } from "lucide-react"

export const Landing = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
      title: "Chat-based Form",
      description: "Điền form qua cuộc trò chuyện tự nhiên thay vì form truyền thống",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Tùy chỉnh Phong cách",
      description: "Chọn phong cách form phù hợp hoặc tạo phong cách riêng của bạn",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      title: "Phân tích Chi tiết",
      description: "Nhận phân tích sâu về các câu trả lời của người dùng",
    },
    {
      icon: <Share2 className="w-8 h-8 text-purple-500" />,
      title: "Chia sẻ Dễ dàng",
      description: "Tạo link chia sẻ form với người khác một cách nhanh chóng",
    },
    {
      icon: <Users className="w-8 h-8 text-pink-500" />,
      title: "Lấy Phản hồi",
      description: "Thu thập phản hồi từ khách hàng, người dùng một cách hiệu quả",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-orange-500" />,
      title: "AI-Powered",
      description: "Công nghệ AI giúp tối ưu hóa trải nghiệm người dùng",
    },
  ]

  const steps = [
    {
      number: 1,
      title: "Đăng nhập/Đăng ký",
      description: "Tạo tài khoản của bạn hoặc đăng nhập vào hệ thống",
    },
    {
      number: 2,
      title: "Nhập URL Form",
      description: "Cung cấp URL của form trên web mà bạn muốn chuyển đổi",
    },
    {
      number: 3,
      title: "Chọn Phong cách",
      description: "Lựa chọn phong cách chat phù hợp với nhu cầu của bạn",
    },
    {
      number: 4,
      title: "Chia sẻ Link",
      description: "Nhận link chia sẻ và gửi cho người dùng của bạn",
    },
    {
      number: 5,
      title: "Nhận Câu trả lời",
      description: "Người dùng điền form qua chat và bạn nhận được các câu trả lời",
    },
    {
      number: 6,
      title: "Phân tích Kết quả",
      description: "Xem phân tích chi tiết và đưa ra quyết định dựa trên dữ liệu",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">FormTalk</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200 font-medium transition-colors cursor-pointer"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Form qua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Cuộc Trò Chuyện</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Chuyển đổi form truyền thống thành cuộc trò chuyện AI thân thiện. Tăng tỉ lệ hoàn thành form lên đến 80% với trải nghiệm chat tự nhiên.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Bắt Đầu Miễn Phí <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                Xem Demo
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl transform -rotate-3">
              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                  <p className="text-sm opacity-90">Assistant</p>
                  <p className="text-base font-medium">Bạn tên gì?</p>
                </div>
                <div className="bg-white/30 rounded-lg p-4 backdrop-blur ml-8">
                  <p className="text-sm opacity-90">You</p>
                  <p className="text-base font-medium">Tôi là Nguyễn Văn A</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                  <p className="text-sm opacity-90">Assistant</p>
                  <p className="text-base font-medium">Tuyệt vời! Bạn đánh giá sản phẩm này như thế nào?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Tính Năng Mạnh Mẽ</h2>
            <p className="text-xl text-gray-600">Mọi thứ bạn cần để tạo form chat hiệu quả</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Cách Sử Dụng</h2>
            <p className="text-xl text-gray-600">6 bước đơn giản để bắt đầu</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                )}

                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full font-bold text-lg mb-4 flex-shrink-0">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Tại Sao Chọn FormTalk?</h2>
              <div className="space-y-6">
                {[
                  "Tăng tỉ lệ hoàn thành form lên đến 80%",
                  "Trải nghiệm người dùng tự nhiên và thân thiện",
                  "Phân tích chi tiết các câu trả lời",
                  "Tích hợp AI để hiểu sâu hơn phản hồi",
                  "Chia sẻ dễ dàng với link công khai",
                  "Bảo mật dữ liệu cao cấp",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-8 text-white shadow-2xl">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur mb-6">
                <p className="text-sm opacity-90 mb-2">Thống kê</p>
                <h3 className="text-3xl font-bold">+50%</h3>
                <p className="text-sm opacity-90">Tăng engagement</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <p className="text-2xl font-bold">80%</p>
                  <p className="text-xs opacity-90">Tỉ lệ hoàn thành</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <p className="text-2xl font-bold">3x</p>
                  <p className="text-xs opacity-90">Nhanh hơn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Sẵn Sàng Bắt Đầu?</h2>
          <p className="text-xl text-blue-100 mb-8">Không cần thẻ tín dụng. Bắt đầu miễn phí ngay hôm nay</p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
          >
            Đăng Ký Ngay <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-bold text-white">FormTalk</span>
              </div>
              <p className="text-sm">Chuyển đổi form qua cuộc trò chuyện AI</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Sản Phẩm</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Tính Năng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Giá Cả</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Tài Liệu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên Hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Công Ty</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Về Chúng Tôi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2026 FormTalk. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-sm hover:text-white transition-colors">Chính Sách Riêng Tư</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Điều Khoản Sử Dụng</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
