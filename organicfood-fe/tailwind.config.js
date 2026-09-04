/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eaf6e6", // hover nhẹ, dropdown bg
          100: "#c5e8bc", // badge bg, tag
          300: "#8fd279",
          400: "#6BC85A",
          500: "#5bbb46", // ★ màu chủ đạo
          600: "#45952f", // hover button
          700: "#2f6e1e", // active, text đậm
        },
        sale: "#ff001e", // giá khuyến mãi, badge đỏ
        badge: "#ff6b00", // nhãn cam (mới, hot...)
        neutral: {
          50: "#f5f5f5", // background trang
          100: "#eeeeee", // border nhẹ
          500: "#666666", // text phụ, mô tả
          800: "#333333", // text chính
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(-8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
