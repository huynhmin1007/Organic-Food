import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

type Member = {
  id: number;
  imageUrl: string;
  name: string;
  originalPrice: number;
  sellingPrice: number;
  discountPercent: number;
};

export default function MemberCard({ member }: { member: Member }) {
  return (
    <Link
      to={`/mi/loc-10-goi-mi-cay-koreno`}
      className="group cursor-pointer block"
    >
      {/* Ảnh */}
      <div className="relative rounded-sm overflow-hidden aspect-square">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-full h-full object-contain p-4"
        />

        {member.discountPercent > 0 && (
          <span
            className="absolute top-2 right-2 bg-sale text-white
                     text-xs font-bold px-1.5 py-0.5 rounded"
          >
            -{member.discountPercent}%
          </span>
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/20
                        translate-y-[40%] opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-500 ease-out
                        flex items-center justify-center"
        >
          <button
            onClick={(e) => {
              e.preventDefault(); // chặn Link navigate
              e.stopPropagation(); // chặn bubble
              // TODO: add to cart
            }}
            className="bg-primary-500 text-white rounded-full p-3 shadow-lg
                       transition-transform hover:scale-110"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-2 pb-4">
        <p
          className="text-sm text-neutral-700 truncate
                group-hover:text-primary-500 transition-colors duration-200"
        >
          {member.name}
        </p>

        {/* Giá */}
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <p className="text-neutral-800 font-bold text-sm">
            {member.sellingPrice.toLocaleString("vi-VN")}đ
          </p>

          {member.discountPercent > 0 && (
            <p className="text-neutral-400 text-xs line-through">
              {member.originalPrice.toLocaleString("vi-VN")}đ
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
