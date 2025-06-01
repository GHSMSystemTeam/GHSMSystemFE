import React from 'react'
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function BookingRating() {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [hover, setHover] = useState(0);

    const handleSubmit = () => {
        onSubmitRating(booking.id, {
            rating,
            feedback,
            date: new Date().toISOString()
        });
    };
    return (
        <div className="mt-4 border-t pt-4">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Đánh giá dịch vụ</h4>

            {/* Star Rating */}
            <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`p-1 ${(hover || rating) >= star
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <Star
                            fill={(hover || rating) >= star ? 'currentColor' : 'none'}
                            size={24}
                        />
                    </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                    {rating ? `${rating} sao` : 'Chưa đánh giá'}
                </span>
            </div>

            {/* Feedback Text */}
            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
            />

            <button
                onClick={handleSubmit}
                disabled={!rating}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Gửi đánh giá
            </button>
        </div>

    )
}
